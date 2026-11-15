package Athari.marketingcommandcenter.data.model

data class GuestAnalytics(
    val totalGuests: Int = 0,
    val newGuests: Int = 0,
    val repeatGuests: Int = 0,
    val avgSpendPerGuest: Double = 0.0,
    val guestRetentionRate: Double = 0.0,
    val topSegments: List<String> = emptyList()
)
