type User = {
    avatar_url: string
    banner_url: string
    profile_url: string
    username: string
    display_name: string
}

type Images = {
    url: string
    width: string
    height: string
    size?: string
    mp4?: string
    mp4_size?: string
    webp?: string
    webp_size?: string
}

interface Gif {
    type: string,
    id: string,
    slug: string,
    url: string,
    bitly_url: string,
    embed_url: string,
    username: string,
    source: string,
    rating: string,
    content_url: string,
    user: User,
    source_tld: string,
    source_post_url: string,
    update_datetime: string,
    create_datetime: string,
    import_datetime: string,
    trending_datetime: string,
    images: {
        [key: string]: Images
    },
    title: string
}

interface ReducedGif {
    title: string,
    preview: Images,
    original: Images
}

interface Pagination {
    offset: number,
    total_count: number,
    count: number
}

interface Meta {
    msg: string,
    status: number,
    response_id: string
}

interface GiphyResponse {
    data: Gif[],
    meta: Meta
    pagination: Pagination,
}

interface ReducedGiphyResponse {
    images: ReducedGif[],
    meta: Meta
    pagination: Pagination,
}

export {
    Gif,
    ReducedGif,
    Pagination,
    Meta,
    GiphyResponse,
    ReducedGiphyResponse
}
