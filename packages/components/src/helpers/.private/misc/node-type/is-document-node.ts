export function isDocumentNode(input: Node): input is Document {
  return input.nodeType === Node.DOCUMENT_NODE;
}
