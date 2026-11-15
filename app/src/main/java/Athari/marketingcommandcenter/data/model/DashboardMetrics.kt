package Athari.marketingcommandcenter.data.model

data class DashboardMetrics(
    val totalSpend: Double = 0.0,
    val totalRevenue: Double = 0.0,
    val blendedRoas: Double = 0.0,
    val activeCampaignsCount: Int = 0,
    val totalReservations: Int = 0,
    val totalGuests: Int = 0,
    val newCustomers: Int = 0,
    val repeatCustomers: Int = 0,
    val topCampaign: Campaign? = null,
    val underperformingCampaign: Campaign? = null
)
