package Athari.marketingcommandcenter.data.model

data class ChannelPerformance(
    val channel: String,
    val spend: Double,
    val revenue: Double,
    val roas: Double,
    val reservations: Int = 0,
    val guests: Int = 0
)
