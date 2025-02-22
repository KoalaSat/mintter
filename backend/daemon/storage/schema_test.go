package storage

import (
	"context"
	"fmt"
	"log"
	"testing"

	"crawshaw.io/sqlite"
	"github.com/stretchr/testify/require"
)

func TestSchemaForeignKeyIndexes(t *testing.T) {
	// This test makes sure that all child foreign key columns are covered by at least one index.
	// Sometimes not having one could be justified, e.g. when the child table is very small, and not expensive to full scan,
	// but on the other hand, the overhead of having an index for these small tables would be even smaller. So it's probably
	// easier to just have a rule to make these columns always indexed.

	db, err := OpenSQLite("file::memory:?mode=memory&cache=shared", 0, 1)
	require.NoError(t, err)
	defer db.Close()

	ctx := context.Background()
	require.NoError(t, InitSQLiteSchema(db))

	conn, release, err := db.Conn(ctx)
	require.NoError(t, err)
	defer release()

	introspectSchema(t, conn)
}

func introspectSchema(t *testing.T, conn *sqlite.Conn) {
	// This code was written with the help of ChatGPT,
	// so it's not the most optimal thing in the world.

	stmt := conn.Prep("SELECT name FROM sqlite_master WHERE type = 'table';")

	for {
		hasRow, err := stmt.Step()
		if err != nil {
			log.Fatal(err)
		}
		if !hasRow {
			require.NoError(t, stmt.Finalize())
			break
		}

		tableName := stmt.ColumnText(0)

		foreignKeysStmt := conn.Prep(fmt.Sprintf("PRAGMA foreign_key_list(%s);", tableName))

		for {
			hasRow, err := foreignKeysStmt.Step()
			if err != nil {
				log.Fatal(err)
			}
			if !hasRow {
				require.NoError(t, foreignKeysStmt.Finalize())
				break
			}

			from := foreignKeysStmt.ColumnText(3)

			indexesStmt := conn.Prep(fmt.Sprintf("PRAGMA index_list(%s);", tableName))

			var found bool
			for {
				hasRow, err := indexesStmt.Step()
				if err != nil {
					log.Fatal(err)
				}
				if !hasRow {
					require.NoError(t, indexesStmt.Finalize())
					break
				}

				indexName := indexesStmt.ColumnText(1)

				// We are only interested in the first column in case of a compound index.
				indexColumnsStmt := conn.Prep(fmt.Sprintf("SELECT * FROM pragma_index_info('%s') WHERE seqno = 0;", indexName))

				for {
					hasRow, err := indexColumnsStmt.Step()
					if err != nil {
						log.Fatal(err)
					}
					if !hasRow {
						require.NoError(t, indexColumnsStmt.Finalize())
						break
					}

					columnName := indexColumnsStmt.ColumnText(2)
					if columnName == from {
						found = true
						require.NoError(t, indexColumnsStmt.Finalize())
						break
					}
				}
				if found {
					require.NoError(t, indexesStmt.Finalize())
					break
				}
			}

			if !found {
				t.Errorf("Table %s foreign key on column %s is not covered by any index", tableName, from)
			}
		}
	}
}
