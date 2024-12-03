package com.se.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class ShopInfoForGuestResponse {
    private String shopName;       // Tên cửa hàng
    private int followers;         // Số lượng người theo dõi
    private Double rating;            // Xếp hạng
    private String address;       // Tỉnh/Thành phố
    private int numberOfProduct;   // Số lượng sản phẩm
    private boolean isFollowed;    // Trạng thái đã theo dõi
}
