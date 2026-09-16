import os
import re

md_file = "../Computer_Architecture_Cache_VirtualMemory_Malloc_DeepDive.md"
with open(md_file, "r", encoding="utf-8") as f:
    text = f.read()

fixed_c_code = """int main() {
    printf("=======================================================\\n");
    printf(" 1. KIỂM TRA KHO BÁN LẺ HEAP & CHUNK METADATA (16-BYTE) \\n");
    printf("=======================================================\\n");

    // Xin 2 khối 1KB (1024 Bytes)
    char *p1 = (char *)malloc(1024);
    char *p2 = (char *)malloc(1024);

    printf("Địa chỉ con trỏ p1: %p\\n", (void *)p1);
    printf("Địa chỉ con trỏ p2: %p\\n", (void *)p2);

    // Tính khoảng cách giữa 2 con trỏ
    uintptr_t diff = (uintptr_t)p2 - (uintptr_t)p1;
    printf("Khoảng cách p2 - p1: %lu Bytes\\n", diff);
    printf("-> Giải thích: 1024 Bytes dữ liệu + 16 Bytes Metadata ẩn = 1040 Bytes!\\n");

    // SOI TRỰC TIẾP VÀO METADATA ẨN NẰM TRƯỚC P1
    // Lùi con trỏ p1 về trước 8 bytes để đọc Size Header
    size_t *metadata_size_ptr = (size_t *)((char *)p1 - 8);
    // Xóa bỏ các bit cờ (flags) ở 3 bit cuối bằng phép AND bít (~7)
    size_t actual_chunk_size = *metadata_size_ptr & ~7;
    printf("Đọc trực tiếp từ Chunk Metadata nằm trước p1: Chunk Size = %lu Bytes\\n", actual_chunk_size);


    printf("\\n=======================================================\\n");
    printf(" 2. KIỂM TRA CƠ CHẾ TÁI SỬ DỤNG BỘ NHỚ (FREE LISTS)    \\n");
    printf("=======================================================\\n");

    printf("Gọi free(p1) -> Trả p1 về kho Free List của malloc...\\n");
    free(p1);

    char *p3 = (char *)malloc(1024); // Xin lại 1KB
    printf("Địa chỉ con trỏ p3 (khi xin lại 1KB): %p\\n", (void *)p3);

    if (p3 == p1) {
        printf("=> KẾT QUẢ: p3 TRÙNG HOÀN TOÀN với p1 cũ!\\n");
        printf("   malloc đã tái sử dụng ngay ô nhớ rảnh trong Free List ở User Space,\\n");
        printf("   hoàn toàn KHÔNG cần gọi System Call xin Kernel.\\n");
    }


    printf("\\n=======================================================\\n");
    printf(" 3. KIỂM TRA NGOẠI LỆ CẤP PHÁT CỰC LỚN (GỌI MMAP)      \\n");
    printf("=======================================================\\n");

    // Xin 10 MB (vượt xa ngưỡng Heap 128KB)
    size_t large_size = 10 * 1024 * 1024;
    char *p_large = (char *)malloc(large_size);

    printf("Địa chỉ p_large (10 MB): %p\\n", (void *)p_large);
    printf("-> Giải thích: Địa chỉ này nhảy sang phân vùng mmap hoàn toàn khác biệt\\n");
    printf("   so với địa chỉ Heap (%p) ở trên!\\n", (void *)p2);


    // Dọn dẹp tài nguyên
    free(p2);
    free(p3);
    free(p_large);

    return 0;
}"""

# Use lambda to bypass re.sub's escape processing
text = re.sub(r'int main\(\) \{.*?return 0;\n\}', lambda m: fixed_c_code, text, flags=re.DOTALL)

with open(md_file, "w", encoding="utf-8") as f:
    f.write(text)

html_file = 'index.html'
with open(html_file, 'r', encoding='utf-8') as f:
    html_content = f.read()

escaped_md = text.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

start_marker = "const rawMarkdown = `"
start_idx = html_content.find(start_marker)

end_marker_search = html_content.find("// Custom renderer", start_idx)
end_idx = html_content.rfind('`;', start_idx, end_marker_search)

if start_idx != -1 and end_idx != -1:
    new_html = html_content[:start_idx] + "const rawMarkdown = `" + escaped_md + html_content[end_idx:]
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("SUCCESS: C code perfectly fixed and injected!")
else:
    print("FAILED to update HTML!")

