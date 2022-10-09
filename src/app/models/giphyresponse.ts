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
    size: string
    mp4: string
    mp4_size: string
    webp: string
    webp_size: string
}

type Video = {
    height: string,
    url: string,
    width: string
}

interface Clip {
    type: string,
    id: string,
    url: string,
    embed_url: string,
    duration: string,
    username: string,
    source: string,
    title: string,
    rating: string,
    cta?: any,
    images: {
        [key: string]: Images
    },
    user: User,
    video: {
        assets: {
            [key: string]: Video
        },
        duration: number
    }
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

interface ReducedData {
    title: string,
    id: string,
    preview: string,
    original: string
    type: string,
    favorite: boolean
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

interface GiphyResponseGifs {
    data: Gif[],
    meta: Meta
    pagination: Pagination,
}

interface GiphyResponseClips {
    data: Clip[],
    meta: Meta,
    pagination: Pagination
}

interface ReducedGiphyResponse {
    images: ReducedData[],
    meta: Meta
    pagination: Pagination,
}

export {
    Gif,
    Clip,
    ReducedData,
    Pagination,
    Meta,
    GiphyResponseGifs,
    GiphyResponseClips,
    ReducedGiphyResponse
}
