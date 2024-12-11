from langchain_text_splitters import RecursiveCharacterTextSplitter

def handle_text_splitter_with_huggingface(tokenizer):
  return RecursiveCharacterTextSplitter.from_huggingface_tokenizer(
      tokenizer = tokenizer,
      separators = ["\n\n", "."],
      chunk_size = 1024,
      chunk_overlap = 0,
  )
  
def handle_text_splitter():
  return RecursiveCharacterTextSplitter(
      separators = ["\n\n", "."],
      chunk_size = 500,
      chunk_overlap = 0,
  )