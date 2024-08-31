export interface Welcome3 {
    "2":       The2;
    _location: string;
    app:       App;
}

export interface The2 {
    hey:            string;
    isAd:           boolean;
    botInfo:        BotInfo;
    initialData:    InitialData;
    starlingData:   StarlingData;
    og_info:        string;
    pathname:       string;
    realRegion:     string;
    vRegions:       { [key: string]: string };
    currentVRegion: string;
}

export interface BotInfo {
    isMock:      boolean;
    isBot:       boolean;
    type:        null;
    requestURL:  string;
    requestTime: number;
}

export interface InitialData {
    productInfoCode: number;
    productInfo:     ProductInfo;
}

export interface ProductInfo {
    product_id:              string;
    status:                  number;
    seller:                  Seller;
    product_base:            ProductBase;
    sale_props:              SaleProp[];
    skus:                    Skus[];
    logistic:                Logistic;
    product_detail_review:   ProductDetailReview;
    customer_service_schema: string;
    chain_key:               string;
    add_to_cart_button:      ProductInfoAddToCartButton;
    seller_id:               string;
    platform:                number;
    source:                  string;
    source_from:             number;
    extra:                   Extra;
    default_address_id:      string;
    template:                number;
    marketing_config:        MarketingConfig;
    announcements:           Announcement[];
    shipping:                Shipping;
    sku_style:               number;
    terms_of_service:        PrivacyPolicy;
    privacy_policy:          PrivacyPolicy;
    biz_type:                number;
    pdp_logistic_module:     PDPLogisticModule;
}

export interface ProductInfoAddToCartButton {
    status:       number;
    click_hint:   string;
    button_style: number;
    popup_style:  number;
}

export interface Announcement {
    material_type:          number;
    text:                   string;
    announcement_show_type: number;
    clickable:              boolean;
    da_info:                string;
}

export interface Extra {
    mix_product_type: string;
}

export interface Logistic {
    delivery_option:           number;
    delivery_name:             string;
    is_default:                boolean;
    reachable:                 boolean;
    lead_time:                 string;
    shipping_fee:              ShippingFee;
    free_shipping:             boolean;
    logistic_text:             Options;
    logistics_service_id:      string;
    with_voucher:              boolean;
    delivery_min_days:         number;
    delivery_max_days:         number;
    logistic_promotion:        Options;
    event_tracking:            EventTracking;
    original_shipping_val:     string;
    transit_delivery_min_days: number;
    transit_delivery_max_days: number;
    leadtime_display_strategy: LeadtimeDisplayStrategy;
}

export interface EventTracking {
    est_delivery_day_max:          string;
    est_logistic_delivery_day_min: string;
    est_logistic_delivery_day_max: string;
    shipping_currency:             string;
    shipping_price:                string;
    ship_from:                     string;
    shipping_type:                 string;
    est_delivery_day_min:          string;
}

export interface LeadtimeDisplayStrategy {
    display_edt:          boolean;
    display_tts_delivery: boolean;
}

export interface Options {
}

export interface ShippingFee {
    price_str: string;
    price_val: string;
    currency:  string;
}

export interface MarketingConfig {
    remove_price_str:    boolean;
    show_deduction_text: boolean;
}

export interface PDPLogisticModule {
    module_id:            string;
    meta:                 PDPLogisticModuleMeta;
    module_title:         string;
    shipping_module:      ShippingModule;
    return_policy_module: ReturnPolicyModule;
}

export interface PDPLogisticModuleMeta {
    pdp_to_logistic_list_info: string;
}

export interface ReturnPolicyModule {
    title:                  string;
    description_list_arrow: DescriptionListArrow;
}

export interface DescriptionListArrow {
    icon:      IconClass;
    icon_dark: IconClass;
}

export interface IconClass {
    height:   number;
    width:    number;
    uri:      string;
    url_list: string[];
}

export interface ShippingModule {
    title:                  string;
    description_list:       DescriptionList[];
    description_list_arrow: DescriptionListArrow;
    meta:                   ShippingModuleMeta;
}

export interface DescriptionList {
    template:        string;
    text_color:      string;
    text_dark_color: string;
}

export interface ShippingModuleMeta {
    delivery_info: string;
    delivery_flag: string;
    edt_type:      string;
}

export interface PrivacyPolicy {
    draft_id:         string;
    support_language: string[];
}

export interface ProductBase {
    title:          string;
    desc_detail:    string;
    desc_video:     DescVideo;
    images:         Image[];
    specifications: Specification[];
    sold_count:     number;
    price:          ProductBasePrice;
}

export interface DescVideo {
    id:          string;
    duration:    number;
    post_url:    string;
    media_type:  string;
    video_infos: VideoInfo[];
    da_info:     string;
}

export interface VideoInfo {
    main_url:      string;
    backup_url:    string;
    url_expire:    number;
    width:         number;
    height:        number;
    file_hash:     string;
    format:        string;
    size:          number;
    bitrate:       number;
    video_quality: string;
}

export interface Image {
    height:         number;
    width:          number;
    thumb_uri:      string;
    thumb_url_list: string[];
    uri:            string;
    url_list:       string[];
}

export interface ProductBasePrice {
    original_price:         string;
    real_price:             string;
    discount:               string;
    need_icon:              boolean;
    is_interval_price:      boolean;
    min_sku_price:          string;
    currency:               string;
    min_sku_original_price: string;
    currency_symbol:        string;
    symbol_position:        number;
}

export interface Specification {
    name:  string;
    value: string;
}

export interface ProductDetailReview {
    product_rating:      number;
    review_count:        number;
    review_items:        ReviewItem[];
    review_count_str:    string;
    review_count_str_v2: string;
}

export interface ReviewItem {
    review:             Review;
    sku_id:             string;
    sku_specification:  string;
    review_user:        ReviewUser;
    is_owner:           boolean;
    is_anonymous:       boolean;
    review_source_type: number;
    review_source_name: string;
    link:               string;
    is_updated:         boolean;
}

export interface Review {
    review_id:            string;
    rating:               number;
    display_text:         string;
    images:               Image[];
    review_timestamp:     string;
    has_origin_text:      boolean;
    display_review_text:  DisplayReviewText[];
    media:                Media[];
    review_timestamp_fmt: string;
    main_review_title:    string;
}

export interface DisplayReviewText {
    text_type:  number;
    plain_text: string;
}

export interface Media {
    media_type: number;
    image:      Image;
}

export interface ReviewUser {
    name:   string;
    avatar: ReviewUserAvatar;
    link:   string;
}

export interface ReviewUserAvatar {
    url_list: string[];
}

export interface SaleProp {
    prop_id:          string;
    prop_name:        string;
    has_image:        boolean;
    sale_prop_values: SalePropValue[];
    size_show_type:   number;
}

export interface SalePropValue {
    prop_value_id: string;
    prop_value:    string;
    image?:        Image;
}

export interface Seller {
    seller_id:       string;
    name:            string;
    avatar:          IconClass;
    product_count:   number;
    status:          number;
    seller_location: string;
    shop_recommend:  ShopRecommend;
    is_hide:         boolean;
}

export interface ShopRecommend {
    is_recommend: boolean;
}

export interface Shipping {
    logistics:                Logistic[];
    shipping_to_address_info: ShippingToAddressInfo;
    ship_from_info:           ShipFromInfo;
}

export interface ShipFromInfo {
    from_overseas: string;
}

export interface ShippingToAddressInfo {
    no_ship_to_addr:       boolean;
    ship_to_button_text:   string;
    ship_to_address_brief: string;
}

export interface Skus {
    sku_id:                   string;
    sku_sale_props:           SkuSaleProp[];
    sale_prop_value_ids:      string;
    stock:                    number;
    purchase_limit:           number;
    price:                    SkusPrice;
    need_icon:                boolean;
    add_to_cart_button:       SkusAddToCartButton;
    warehouse_id:             string;
    promotion_view:           Options;
    quantity_property:        QuantityProperty;
    buy_button:               BuyButton;
    minimum_buy_quantity:     number;
    promotion_limit_quantity: number;
    deduction_text:           string;
    status:                   number;
    pdp_button_area_id?:      string;
    need_refresh?:            boolean;
}

export interface SkusAddToCartButton {
    status:      number;
    popup_style: number;
}

export interface BuyButton {
    desc:         string;
    default_desc: string;
}

export interface SkusPrice {
    real_price:           ShippingFee;
    original_price:       string;
    discount:             string;
    original_price_value: string;
    unit_price_desc:      string;
}

export interface QuantityProperty {
    default_add_cart_quantity:   number;
    quantity_minus_support_edit: boolean;
}

export interface SkuSaleProp {
    prop_id:       string;
    prop_name:     string;
    prop_value_id: string;
    prop_value:    string;
}

export interface StarlingData {
    lang:       string;
    localeData: { [key: string]: { [key: string]: string } };
    options:    Options;
}

export interface App {
    global: string;
}