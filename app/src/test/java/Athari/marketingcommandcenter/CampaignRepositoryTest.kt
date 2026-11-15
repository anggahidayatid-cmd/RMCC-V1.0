package Athari.marketingcommandcenter

import Athari.marketingcommandcenter.data.model.Campaign
import Athari.marketingcommandcenter.data.model.CampaignStatus
import Athari.marketingcommandcenter.data.model.CampaignType
import Athari.marketingcommandcenter.data.repository.CampaignRepositoryImpl
import Athari.marketingcommandcenter.ui.viewmodel.CampaignViewModel
import Athari.marketingcommandcenter.ui.viewmodel.DashboardViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class CampaignRepositoryTest {

    private val testDispatcher = StandardTestDispatcher()
    private lateinit var repository: CampaignRepositoryImpl

    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        repository = CampaignRepositoryImpl()
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun testRoasCalculation() {
        val campaign = Campaign(
            name = "Test Promo",
            code = "TEST-01",
            startDate = "2026-10-01",
            endDate = "2026-10-31",
            budget = 10000000.0,
            spend = 5000000.0,
            revenue = 25000000.0
        )
        assertEquals(5.0, campaign.roas, 0.001)

        val zeroSpendCampaign = Campaign(
            name = "Zero Spend",
            code = "ZERO-01",
            startDate = "2026-10-01",
            endDate = "2026-10-31",
            budget = 10000000.0,
            spend = 0.0,
            revenue = 0.0
        )
        assertEquals(0.0, zeroSpendCampaign.roas, 0.001)
    }

    @Test
    fun testPreloadedDemoData() = runTest {
        val campaigns = repository.getCampaigns().first()
        assertEquals(4, campaigns.size)

        val weekendFamily = campaigns.find { it.code == "WEEKEND-26" }
        assertNotNull(weekendFamily)
        assertEquals("Weekend Family", weekendFamily?.name)
        assertEquals(CampaignType.PROMOTION, weekendFamily?.type)
        assertEquals(6400000.0, weekendFamily?.spend ?: 0.0, 0.01)
        assertEquals(38200000.0, weekendFamily?.revenue ?: 0.0, 0.01)
        assertEquals(CampaignStatus.ACTIVE, weekendFamily?.status)

        val bday = campaigns.find { it.code == "BDAY-26" }
        assertNotNull(bday)
        assertEquals(CampaignType.CRM, bday?.type)

        val liveMusic = campaigns.find { it.code == "LIVE-OCT" }
        assertNotNull(liveMusic)
        assertEquals(CampaignType.EVENT, liveMusic?.type)

        val lunchWd = campaigns.find { it.code == "LUNCH-WD" }
        assertNotNull(lunchWd)
        assertEquals(CampaignStatus.PAUSED, lunchWd?.status)
    }

    @Test
    fun testDashboardMetricsCalculation() = runTest {
        val metrics = repository.getDashboardMetrics().first()
        // Total spend = 6.4m + 3.8m + 7.2m + 5.2m = 22.6m
        assertEquals(22600000.0, metrics.totalSpend, 0.01)
        // Total revenue = 38.2m + 18.4m + 41.8m + 21.8m = 120.2m
        assertEquals(120200000.0, metrics.totalRevenue, 0.01)
        // Active campaigns count = 3 (Weekend Family, Bday, Live Music)
        assertEquals(3, metrics.activeCampaignsCount)
        // Blended ROAS = 120.2m / 22.6m ≈ 5.318
        assertEquals(5.318, metrics.blendedRoas, 0.01)
    }

    @Test
    fun testCampaignCrudOperations() = runTest {
        val newCampaign = Campaign(
            id = "CAMP-999",
            name = "New Season Deal",
            code = "SEASON-99",
            type = CampaignType.SEASONAL,
            channel = "Meta Ads",
            startDate = "2026-11-01",
            endDate = "2026-11-30",
            budget = 10000000.0,
            spend = 2000000.0,
            revenue = 10000000.0,
            status = CampaignStatus.SCHEDULED
        )

        repository.addCampaign(newCampaign)
        var list = repository.getCampaigns().first()
        assertEquals(5, list.size)
        assertTrue(list.any { it.id == "CAMP-999" })

        val updatedCampaign = newCampaign.copy(
            spend = 3000000.0,
            revenue = 18000000.0,
            status = CampaignStatus.ACTIVE
        )
        repository.updateCampaign(updatedCampaign)
        list = repository.getCampaigns().first()
        val fetched = list.find { it.id == "CAMP-999" }
        assertNotNull(fetched)
        assertEquals(3000000.0, fetched?.spend ?: 0.0, 0.01)
        assertEquals(CampaignStatus.ACTIVE, fetched?.status)

        repository.deleteCampaign("CAMP-999")
        list = repository.getCampaigns().first()
        assertEquals(4, list.size)
        assertNull(list.find { it.id == "CAMP-999" })
    }

    @Test
    fun testCampaignViewModelSearchAndFilter() = runTest {
        val viewModel = CampaignViewModel(repository)
        backgroundScope.launch { viewModel.filteredCampaigns.collect {} }
        backgroundScope.launch { viewModel.campaigns.collect {} }
        testScheduler.advanceUntilIdle()

        assertEquals(4, viewModel.campaigns.value.size)

        viewModel.onSearchQueryChanged("Family")
        testScheduler.advanceUntilIdle()
        assertEquals(1, viewModel.filteredCampaigns.value.size)
        assertEquals("Weekend Family", viewModel.filteredCampaigns.value.first().name)

        viewModel.onSearchQueryChanged("")
        viewModel.onStatusFilterChanged(CampaignStatus.PAUSED)
        testScheduler.advanceUntilIdle()
        assertEquals(1, viewModel.filteredCampaigns.value.size)
        assertEquals("Lunch Weekday", viewModel.filteredCampaigns.value.first().name)

        viewModel.onStatusFilterChanged(null)
        viewModel.onChannelFilterChanged("WhatsApp")
        testScheduler.advanceUntilIdle()
        assertEquals(2, viewModel.filteredCampaigns.value.size)

        viewModel.clearFilters()
        testScheduler.advanceUntilIdle()
        assertEquals(4, viewModel.filteredCampaigns.value.size)
    }

    @Test
    fun testCampaignViewModelSelectionAndCrud() = runTest {
        val viewModel = CampaignViewModel(repository)
        backgroundScope.launch { viewModel.campaigns.collect {} }
        backgroundScope.launch { viewModel.selectedCampaign.collect {} }
        backgroundScope.launch { viewModel.userMessage.collect {} }
        testScheduler.advanceUntilIdle()

        viewModel.selectCampaign("CAMP-001")
        testScheduler.advanceUntilIdle()
        assertEquals("Weekend Family", viewModel.selectedCampaign.value?.name)

        val newCamp = Campaign(
            id = "CAMP-777",
            name = "Test Special",
            code = "TEST-77",
            startDate = "2026-10-01",
            endDate = "2026-10-31",
            budget = 5000000.0,
            spend = 1000000.0,
            revenue = 6000000.0
        )
        viewModel.addCampaign(newCamp)
        testScheduler.advanceUntilIdle()
        assertEquals(5, viewModel.campaigns.value.size)
        assertTrue(viewModel.userMessage.value?.contains("added successfully") == true)

        viewModel.deleteCampaign("CAMP-777")
        testScheduler.advanceUntilIdle()
        assertEquals(4, viewModel.campaigns.value.size)
        assertTrue(viewModel.userMessage.value?.contains("deleted successfully") == true)
    }

    @Test
    fun testDashboardViewModel() = runTest {
        val viewModel = DashboardViewModel(repository)
        backgroundScope.launch { viewModel.dashboardMetrics.collect {} }
        backgroundScope.launch { viewModel.workspace.collect {} }
        backgroundScope.launch { viewModel.channelPerformance.collect {} }
        backgroundScope.launch { viewModel.managementInsights.collect {} }
        testScheduler.advanceUntilIdle()

        assertEquals("Gourmet Bistro Cafe & Resto", viewModel.workspace.value.name)
        assertEquals(22600000.0, viewModel.dashboardMetrics.value.totalSpend, 0.01)
        assertTrue(viewModel.channelPerformance.value.isNotEmpty())
        assertTrue(viewModel.managementInsights.value.isNotEmpty())
    }
}
