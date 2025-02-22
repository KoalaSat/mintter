// @generated by protoc-gen-es v1.3.1 with parameter "target=ts,import_extension=none"
// @generated from file documents/v1alpha/comments.proto (package com.mintter.documents.v1alpha, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { Block } from "./documents_pb";

/**
 * Request to create a conversation.
 *
 * @generated from message com.mintter.documents.v1alpha.CreateConversationRequest
 */
export class CreateConversationRequest extends Message<CreateConversationRequest> {
  /**
   * Required. The ID of the publication for which the conversation should be created.
   *
   * @generated from field: string document_id = 1;
   */
  documentId = "";

  /**
   * Required. Selected portions in the original document which are being commented on.
   * At least one element must be present.
   *
   * @generated from field: repeated com.mintter.documents.v1alpha.Selector selectors = 2;
   */
  selectors: Selector[] = [];

  /**
   * Required. The first comment that starts the conversation.
   *
   * @generated from field: com.mintter.documents.v1alpha.Block initial_comment = 3;
   */
  initialComment?: Block;

  constructor(data?: PartialMessage<CreateConversationRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.documents.v1alpha.CreateConversationRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "document_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "selectors", kind: "message", T: Selector, repeated: true },
    { no: 3, name: "initial_comment", kind: "message", T: Block },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateConversationRequest {
    return new CreateConversationRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateConversationRequest {
    return new CreateConversationRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateConversationRequest {
    return new CreateConversationRequest().fromJsonString(jsonString, options);
  }

  static equals(a: CreateConversationRequest | PlainMessage<CreateConversationRequest> | undefined, b: CreateConversationRequest | PlainMessage<CreateConversationRequest> | undefined): boolean {
    return proto3.util.equals(CreateConversationRequest, a, b);
  }
}

/**
 * Request to add a comment.
 *
 * @generated from message com.mintter.documents.v1alpha.AddCommentRequest
 */
export class AddCommentRequest extends Message<AddCommentRequest> {
  /**
   * ID of the existing conversation.
   *
   * @generated from field: string conversation_id = 1;
   */
  conversationId = "";

  /**
   * Block corresponding to the text of the comment.
   * Using a block ID that already exists in the conversation will replace the comment.
   *
   * @generated from field: com.mintter.documents.v1alpha.Block comment = 2;
   */
  comment?: Block;

  constructor(data?: PartialMessage<AddCommentRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.documents.v1alpha.AddCommentRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "conversation_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "comment", kind: "message", T: Block },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AddCommentRequest {
    return new AddCommentRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AddCommentRequest {
    return new AddCommentRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AddCommentRequest {
    return new AddCommentRequest().fromJsonString(jsonString, options);
  }

  static equals(a: AddCommentRequest | PlainMessage<AddCommentRequest> | undefined, b: AddCommentRequest | PlainMessage<AddCommentRequest> | undefined): boolean {
    return proto3.util.equals(AddCommentRequest, a, b);
  }
}

/**
 * Request to delete a conversation.
 *
 * @generated from message com.mintter.documents.v1alpha.DeleteConversationRequest
 */
export class DeleteConversationRequest extends Message<DeleteConversationRequest> {
  /**
   * ID of the conversation to delete.
   *
   * @generated from field: string conversation_id = 1;
   */
  conversationId = "";

  constructor(data?: PartialMessage<DeleteConversationRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.documents.v1alpha.DeleteConversationRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "conversation_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteConversationRequest {
    return new DeleteConversationRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteConversationRequest {
    return new DeleteConversationRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteConversationRequest {
    return new DeleteConversationRequest().fromJsonString(jsonString, options);
  }

  static equals(a: DeleteConversationRequest | PlainMessage<DeleteConversationRequest> | undefined, b: DeleteConversationRequest | PlainMessage<DeleteConversationRequest> | undefined): boolean {
    return proto3.util.equals(DeleteConversationRequest, a, b);
  }
}

/**
 * Request to resolve a conversation.
 *
 * @generated from message com.mintter.documents.v1alpha.ResolveConversationRequest
 */
export class ResolveConversationRequest extends Message<ResolveConversationRequest> {
  /**
   * ID of the conversation to resolve.
   *
   * @generated from field: string conversation_id = 1;
   */
  conversationId = "";

  constructor(data?: PartialMessage<ResolveConversationRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.documents.v1alpha.ResolveConversationRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "conversation_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ResolveConversationRequest {
    return new ResolveConversationRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ResolveConversationRequest {
    return new ResolveConversationRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ResolveConversationRequest {
    return new ResolveConversationRequest().fromJsonString(jsonString, options);
  }

  static equals(a: ResolveConversationRequest | PlainMessage<ResolveConversationRequest> | undefined, b: ResolveConversationRequest | PlainMessage<ResolveConversationRequest> | undefined): boolean {
    return proto3.util.equals(ResolveConversationRequest, a, b);
  }
}

/**
 * Response to resolve a conversation.
 *
 * @generated from message com.mintter.documents.v1alpha.ResolveConversationResponse
 */
export class ResolveConversationResponse extends Message<ResolveConversationResponse> {
  constructor(data?: PartialMessage<ResolveConversationResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.documents.v1alpha.ResolveConversationResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ResolveConversationResponse {
    return new ResolveConversationResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ResolveConversationResponse {
    return new ResolveConversationResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ResolveConversationResponse {
    return new ResolveConversationResponse().fromJsonString(jsonString, options);
  }

  static equals(a: ResolveConversationResponse | PlainMessage<ResolveConversationResponse> | undefined, b: ResolveConversationResponse | PlainMessage<ResolveConversationResponse> | undefined): boolean {
    return proto3.util.equals(ResolveConversationResponse, a, b);
  }
}

/**
 * Request to delete a comment from a conversation.
 *
 * @generated from message com.mintter.documents.v1alpha.DeleteCommentRequest
 */
export class DeleteCommentRequest extends Message<DeleteCommentRequest> {
  /**
   * Required. ID of the conversation.
   *
   * @generated from field: string conversation_id = 1;
   */
  conversationId = "";

  /**
   * Required. ID of the comment block to be deleted.
   *
   * @generated from field: string block_id = 2;
   */
  blockId = "";

  constructor(data?: PartialMessage<DeleteCommentRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.documents.v1alpha.DeleteCommentRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "conversation_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "block_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteCommentRequest {
    return new DeleteCommentRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteCommentRequest {
    return new DeleteCommentRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteCommentRequest {
    return new DeleteCommentRequest().fromJsonString(jsonString, options);
  }

  static equals(a: DeleteCommentRequest | PlainMessage<DeleteCommentRequest> | undefined, b: DeleteCommentRequest | PlainMessage<DeleteCommentRequest> | undefined): boolean {
    return proto3.util.equals(DeleteCommentRequest, a, b);
  }
}

/**
 * Request to list conversations.
 *
 * @generated from message com.mintter.documents.v1alpha.ListConversationsRequest
 */
export class ListConversationsRequest extends Message<ListConversationsRequest> {
  /**
   * Required. Document ID for which conversations should be listed.
   *
   * @generated from field: string document_id = 1;
   */
  documentId = "";

  /**
   * Optional. Number of results per page.
   *
   * @generated from field: int32 page_size = 3;
   */
  pageSize = 0;

  /**
   * Optional. Token for the page to return.
   *
   * @generated from field: string page_token = 4;
   */
  pageToken = "";

  constructor(data?: PartialMessage<ListConversationsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.documents.v1alpha.ListConversationsRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "document_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "page_size", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 4, name: "page_token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListConversationsRequest {
    return new ListConversationsRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListConversationsRequest {
    return new ListConversationsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListConversationsRequest {
    return new ListConversationsRequest().fromJsonString(jsonString, options);
  }

  static equals(a: ListConversationsRequest | PlainMessage<ListConversationsRequest> | undefined, b: ListConversationsRequest | PlainMessage<ListConversationsRequest> | undefined): boolean {
    return proto3.util.equals(ListConversationsRequest, a, b);
  }
}

/**
 * Response with a list of conversations.
 *
 * @generated from message com.mintter.documents.v1alpha.ListConversationsResponse
 */
export class ListConversationsResponse extends Message<ListConversationsResponse> {
  /**
   * Conversations matching the list request.
   *
   * @generated from field: repeated com.mintter.documents.v1alpha.Conversation conversations = 1;
   */
  conversations: Conversation[] = [];

  /**
   * Token for the next page if there're any.
   *
   * @generated from field: string next_page_token = 2;
   */
  nextPageToken = "";

  constructor(data?: PartialMessage<ListConversationsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.documents.v1alpha.ListConversationsResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "conversations", kind: "message", T: Conversation, repeated: true },
    { no: 2, name: "next_page_token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListConversationsResponse {
    return new ListConversationsResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListConversationsResponse {
    return new ListConversationsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListConversationsResponse {
    return new ListConversationsResponse().fromJsonString(jsonString, options);
  }

  static equals(a: ListConversationsResponse | PlainMessage<ListConversationsResponse> | undefined, b: ListConversationsResponse | PlainMessage<ListConversationsResponse> | undefined): boolean {
    return proto3.util.equals(ListConversationsResponse, a, b);
  }
}

/**
 * Selector defines the selected portion of text in a given block as an open-ended interval [start, end).
 * If the interval is missing, the whole block is assumed.
 *
 * @generated from message com.mintter.documents.v1alpha.Selector
 */
export class Selector extends Message<Selector> {
  /**
   * Required. ID of the block in the original document which is being commented on.
   *
   * @generated from field: string block_id = 1;
   */
  blockId = "";

  /**
   * Required. Specific block revision which is being commented.
   *
   * @generated from field: string block_revision = 2;
   */
  blockRevision = "";

  /**
   * Optional. Start position of the selection within the block. Expressed in Unicode Code Points.
   * If start is specified, end must be specified as well. Must be start < end.
   *
   * @generated from field: int32 start = 3;
   */
  start = 0;

  /**
   * Optional. End position of the selection within the block. Expressed in Unicode Code Points.
   * Required if start was specified. Must be greater than start if specified.
   *
   * @generated from field: int32 end = 4;
   */
  end = 0;

  constructor(data?: PartialMessage<Selector>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.documents.v1alpha.Selector";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "block_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "block_revision", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "start", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 4, name: "end", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Selector {
    return new Selector().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Selector {
    return new Selector().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Selector {
    return new Selector().fromJsonString(jsonString, options);
  }

  static equals(a: Selector | PlainMessage<Selector> | undefined, b: Selector | PlainMessage<Selector> | undefined): boolean {
    return proto3.util.equals(Selector, a, b);
  }
}

/**
 * Conversation is a set of comments anchored to a particular selection in a document.
 *
 * @generated from message com.mintter.documents.v1alpha.Conversation
 */
export class Conversation extends Message<Conversation> {
  /**
   * ID of the Conversation.
   *
   * @generated from field: string id = 1;
   */
  id = "";

  /**
   * Selected portions of the original document which are being commented on.
   *
   * @generated from field: repeated com.mintter.documents.v1alpha.Selector selectors = 2;
   */
  selectors: Selector[] = [];

  /**
   * List of comments in the conversation.
   * Ordered by time.
   *
   * @generated from field: repeated com.mintter.documents.v1alpha.Block comments = 3;
   */
  comments: Block[] = [];

  constructor(data?: PartialMessage<Conversation>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.documents.v1alpha.Conversation";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "selectors", kind: "message", T: Selector, repeated: true },
    { no: 3, name: "comments", kind: "message", T: Block, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Conversation {
    return new Conversation().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Conversation {
    return new Conversation().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Conversation {
    return new Conversation().fromJsonString(jsonString, options);
  }

  static equals(a: Conversation | PlainMessage<Conversation> | undefined, b: Conversation | PlainMessage<Conversation> | undefined): boolean {
    return proto3.util.equals(Conversation, a, b);
  }
}

