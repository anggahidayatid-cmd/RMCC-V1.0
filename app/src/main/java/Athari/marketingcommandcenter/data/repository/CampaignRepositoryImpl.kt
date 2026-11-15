package Athari.marketingcommandcenter.data.repository

import Athari.marketingcommandcenter.data.model.Campaign
import Athari.marketingcommandcenter.data.model.CampaignStatus
import Athari.marketingcommandcenter.data.model.CampaignType
import Athari.marketingcommandcenter.data.model.ChannelPerformance
import Athari.marketingcommandcenter.data.model.DashboardMetrics
import Athari.marketingcommandcenter.data.model.Event
import Athari.marketingcommandcenter.data.model.GuestAnalytics
import Athari.marketingcommandcenter.data.model.InsightType
import Athari.marketingcommandcenter.data.model.ManagementInsight
import Athari.marketingcommandcenter.data.model.Workspace
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map

class CampaignRepositoryImpl : CampaignRepository {

    private val initialCampaigns = listOf(
        Campaign(
            id = "CAMP-001",
            restaurantId = "REST-001",
            name = "Weekend Family",
            code = "WEEKEND-26",
            objective = "Drive family dine-in traffic on weekends with bundle package",
            type = CampaignType.PROMOTION,
            channel = "Instagram + WhatsApp",
            startDate = "1 Oct 2026",
            endDate = "31 Oct 2026",
            budget = 8000000.0,
            dailyBudget = 250000.0,
            targetRoas = 4.5,
            targetRevenue = 36000000.0,
            reservationTarget = 120,
            guestTarget = 480,
            spend = 6400000.0,
            revenue = 38200000.0,
            status = CampaignStatus.ACTIVE,
            notes = "Family package promotion running strong on IG Stories and WA broadcast"
        ),
        Campaign(
            id = "CAMP-002",
            restaurantId = "REST-001",
            name = "Birthday Experience",
            code = "BDAY-26",
            objective = "Target birthday celebrants with complimentary dessert & group discount",
            type = CampaignType.CRM,
            channel = "CRM + WhatsApp",
            startDate = "1 Oct 2026",
            endDate = "31 Dec 2026",
            budget = 5000000.0,
            dailyBudget = 150000.0,
            targetRoas = 4.5,
            targetRevenue = 22500000.0,
            reservationTarget = 80,
            guestTarget = 320,
            spend = 3800000.0,
            revenue = 18400000.0,
            status = CampaignStatus.ACTIVE,
            notes = "Automated WA messages triggered 7 days before guest birthday"
        ),
        Campaign(
            id = "CAMP-003",
            restaurantId = "REST-001",
            name = "Live Music October",
            code = "LIVE-OCT",
            objective = "Promote Friday & Saturday live acoustic band sessions",
            type = CampaignType.EVENT,
            channel = "Instagram + TikTok",
            startDate = "5 Oct 2026",
            endDate = "28 Oct 2026",
            budget = 9000000.0,
            dailyBudget = 300000.0,
            targetRoas = 5.0,
            targetRevenue = 45000000.0,
            reservationTarget = 150,
            guestTarget = 600,
            spend = 7200000.0,
            revenue = 41800000.0,
            status = CampaignStatus.ACTIVE,
            notes = "Short video clips on TikTok showing crowd atmosphere driving high conversion"
        ),
        Campaign(
            id = "CAMP-004",
            restaurantId = "REST-001",
            name = "Lunch Weekday",
            code = "LUNCH-WD",
            objective = "Increase lunch hour occupancy for nearby office workers",
            type = CampaignType.TRAFFIC,
            channel = "Google + Meta",
            startDate = "15 Sep 2026",
            endDate = "15 Oct 2026",
            budget = 7000000.0,
            dailyBudget = 200000.0,
            targetRoas = 4.0,
            targetRevenue = 28000000.0,
            reservationTarget = 90,
            guestTarget = 270,
            spend = 5200000.0,
            revenue = 21800000.0,
            status = CampaignStatus.PAUSED,
            notes = "Paused temporarily to refresh creative messaging and lunch menu options"
        )
    )

    private val _campaigns = MutableStateFlow<List<Campaign>>(initialCampaigns)
    private val campaigns = _campaigns.asStateFlow()

    private val _workspace = MutableStateFlow(
        Workspace(
            id = "REST-001",
            name = "Gourmet Bistro Cafe & Resto",
            location = "Jakarta, Indonesia",
            type = "Casual Dining & Resto",
            currency = "Rp",
            timezone = "Asia/Jakarta"
        )
    )
    private val workspace = _workspace.asStateFlow()

    override fun getCampaigns(): Flow<List<Campaign>> = campaigns

    override fun getCampaignById(id: String): Flow<Campaign?> {
        return campaigns.map { list -> list.find { it.id == id || it.code == id } }
    }

    override suspend fun addCampaign(campaign: Campaign) {
        val updated = _campaigns.value.toMutableList().apply {
            add(0, campaign)
        }
        _campaigns.value = updated
    }

    override suspend fun updateCampaign(campaign: Campaign) {
        val updated = _campaigns.value.map { existing ->
            if (existing.id == campaign.id) campaign else existing
        }
        _campaigns.value = updated
    }

    override suspend fun deleteCampaign(id: String) {
        val updated = _campaigns.value.filterNot { it.id == id }
        _campaigns.value = updated
    }

    override fun getDashboardMetrics(): Flow<DashboardMetrics> {
        return campaigns.map { campaignList ->
            val totalSpend = campaignList.sumOf { it.spend }
            val totalRevenue = campaignList.sumOf { it.revenue }
            val blendedRoas = if (totalSpend > 0) totalRevenue / totalSpend else 0.0
            val activeCount = campaignList.count { it.status == CampaignStatus.ACTIVE }

            val topCampaign = campaignList.maxByOrNull { it.roas }
            val underperformingCampaign = campaignList
                .filter { it.status == CampaignStatus.ACTIVE || it.status == CampaignStatus.PAUSED }
                .minByOrNull { it.roas }

            DashboardMetrics(
                totalSpend = totalSpend,
                totalRevenue = totalRevenue,
                blendedRoas = blendedRoas,
                activeCampaignsCount = activeCount,
                totalReservations = 184,
                totalGuests = 520,
                newCustomers = 218,
                repeatCustomers = 302,
                topCampaign = topCampaign,
                underperformingCampaign = underperformingCampaign
            )
        }
    }

    override fun getChannelPerformance(): Flow<List<ChannelPerformance>> {
        return campaigns.map {
            listOf(
                ChannelPerformance("Instagram", 8000000.0, 42000000.0, 5.25, 65, 240),
                ChannelPerformance("TikTok", 5200000.0, 31000000.0, 5.96, 48, 180),
                ChannelPerformance("Meta Ads", 4400000.0, 22000000.0, 5.00, 32, 120),
                ChannelPerformance("Google", 3000000.0, 15000000.0, 5.00, 24, 90),
                ChannelPerformance("WhatsApp", 1200000.0, 8200000.0, 6.83, 15, 60),
                ChannelPerformance("CRM", 800000.0, 2000000.0, 2.50, 0, 0)
            )
        }
    }

    override fun getManagementInsights(): Flow<List<ManagementInsight>> {
        return campaigns.map { list ->
            val insights = mutableListOf<ManagementInsight>()

            val topCamp = list.find { it.code == "LIVE-OCT" } ?: list.maxByOrNull { it.roas }
            if (topCamp != null) {
                insights.add(
                    ManagementInsight(
                        id = "INS-001",
                        type = InsightType.POSITIVE,
                        message = "${topCamp.name} generates highest attributed revenue (Rp41.800.000)."
                    )
                )
            }

            val pausedCamp = list.find { it.code == "LUNCH-WD" } ?: list.find { it.status == CampaignStatus.PAUSED }
            if (pausedCamp != null) {
                insights.add(
                    ManagementInsight(
                        id = "INS-002",
                        type = InsightType.WARNING,
                        message = "${pausedCamp.name} is currently below its 4x target ROAS."
                    )
                )
            }

            val weekendCamp = list.find { it.code == "WEEKEND-26" }
            if (weekendCamp != null) {
                insights.add(
                    ManagementInsight(
                        id = "INS-003",
                        type = InsightType.RECOMMENDATION,
                        message = "${weekendCamp.name} has consumed 80% of budget and remains above target ROAS (5.97x)."
                    )
                )
            }

            insights
        }
    }

    override fun getWorkspace(): Flow<Workspace> = workspace

    override suspend fun updateWorkspace(workspace: Workspace) {
        _workspace.value = workspace
    }

    override fun getGuestAnalytics(): Flow<GuestAnalytics> {
        return campaigns.map { list ->
            val totalGuests = list.sumOf { it.guestTarget }
            val newGuests = (totalGuests * 0.42).toInt()
            val repeatGuests = totalGuests - newGuests
            val totalRevenue = list.sumOf { it.revenue }
            val avgSpend = if (totalGuests > 0) totalRevenue / totalGuests else 0.0

            GuestAnalytics(
                totalGuests = totalGuests,
                newGuests = newGuests,
                repeatGuests = repeatGuests,
                avgSpendPerGuest = avgSpend,
                guestRetentionRate = 0.58,
                topSegments = listOf("Families & Groups", "Birthday Celebrants", "Music Enthusiasts", "Corporate Lunchers")
            )
        }
    }

    override fun getEvents(): Flow<List<Event>> {
        return MutableStateFlow(
            listOf(
                Event(
                    id = "EVT-001",
                    campaignId = "CAMP-003",
                    name = "Friday Acoustic Night",
                    date = "2026-10-17",
                    expectedGuests = 150,
                    actualGuests = 165,
                    status = "Completed"
                ),
                Event(
                    id = "EVT-002",
                    campaignId = "CAMP-003",
                    name = "Saturday Jazz Showcase",
                    date = "2026-10-24",
                    expectedGuests = 180,
                    actualGuests = 0,
                    status = "Upcoming"
                )
            )
        )
    }
}
