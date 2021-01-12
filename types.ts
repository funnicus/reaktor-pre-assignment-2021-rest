export interface Product {
    id: string;
    type: string;
    name: string;
    color: Array<string>;
    price: number;
    manufacturer: string;
}

export interface ProductInfo extends Product {
    awailability: string;
}

export interface Awailability {
    id: string;
    DATAPAYLOAD: string;
}

export interface AwailabilityResponse {
    code: number;
    response: Array<Awailability>
}