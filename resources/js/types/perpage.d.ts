type PerPage = {
    total: number;
    page_size: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    page_size_options: number[];
}

export default PerPage;