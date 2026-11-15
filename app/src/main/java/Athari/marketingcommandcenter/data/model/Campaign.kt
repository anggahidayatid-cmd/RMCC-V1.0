package Athari.marketingcommandcenter.data.model

import java.util.UUID

enum class CampaignType(val displayName: String) {
    PROMOTION("Promotion"),
    EVENT("Event"),
    BRAND_AWARENESS("Brand Awareness"),
    TRAFFIC("Traffic"),
    CRM("CRM"),
    SEASONAL("Seasonal"),
    PARTNERSHIP("Partnership"),
    OTHER("Other")
}

enum class CampaignStatus(val displayName: String) {
    DRAFT("Draft"),
    SCHEDULED("Scheduled"),
    ACTIVE("Active"),
    PAUSED("Paused"),
    COMPLETED("Completed")
}

data class Campaign(
    val id: String = UUID.randomUUID().toString(),
    val restaurantId: String = "REST-001",
    val name: String,
    val code: String,
    val objective: String = "",
    val type: CampaignType = CampaignType.PROMOTION,
    val channel: String = "Multi-channel",
    val startDate: String,
    val endDate: String,
    val budget: Double,
    val dailyBudget: Double = 0.0,
    val targetRoas: Double = 4.0,
    val targetRevenue: Double = 0.0,
    val reservationTarget: Int = 0,
    val guestTarget: Int = 0,
    val spend: Double = 0.0,
    val revenue: Double = 0.0,
    val status: CampaignStatus = CampaignStatus.ACTIVE,
    val notes: String = ""
) {
    /**
     * Calculated ROAS (Return On Ad Spend).
     * Formula: Attributed Revenue / Actual Spend.
     * If spend <= 0, returns 0.0.
     */
    val roas: Double
        get() = if (spend > 0) revenue / spend else 0.0
}
