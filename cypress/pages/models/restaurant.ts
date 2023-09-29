export type Restaurant = {
    name: string;
    neighborhood: string;
    photograph_large: string;
    photograph_large_wide: string;
    photograph_medium_1x: string;
    photograph_medium_2x: string;
    photograph_small_1x: string;
    photograph_small_2x: string;
    alt: string;
    address: string;
    latlng: {
        lat: number;
        lng: number
    };
    cuisine_type: string;
    operating_hours: {
        Monday: string;
        Tuesday: string;
        Wednesday: string;
        Thursday: string;
        Friday: string;
        Saturday: string;
        Sunday: string
    };
    createdAt: number;
    updatedAt: string;
    is_favorite: string;
    id: number
}