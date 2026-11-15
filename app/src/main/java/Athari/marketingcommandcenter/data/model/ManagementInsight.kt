package Athari.marketingcommandcenter.data.model

enum class InsightType(val displayName: String) {
    POSITIVE("Positive"),
    WARNING("Warning"),
    NEGATIVE("Negative"),
    RECOMMENDATION("Recommendation")
}

data class ManagementInsight(
    val id: String,
    val type: InsightType,
    val message: String
)
