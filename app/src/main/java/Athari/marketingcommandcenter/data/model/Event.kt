package Athari.marketingcommandcenter.data.model

data class Event(
    val id: String,
    val campaignId: String? = null,
    val name: String,
    val date: String,
    val expectedGuests: Int = 0,
    val actualGuests: Int = 0,
    val status: String = "Upcoming"
)
