from langchain_text_splitters import RecursiveCharacterTextSplitter

CHUNK_SIZE_TOKENS = 1024

def handle_text_splitter(tokenizer):
  return RecursiveCharacterTextSplitter.from_huggingface_tokenizer(
      tokenizer = tokenizer,
      separators = ["\n\n", "."],
      chunk_size = CHUNK_SIZE_TOKENS,
      chunk_overlap = 0,
  )