package Athari.marketingcommandcenter.data.repository

import Athari.marketingcommandcenter.data.model.Campaign
import Athari.marketingcommandcenter.data.model.ChannelPerformance
import Athari.marketingcommandcenter.data.model.DashboardMetrics
import Athari.marketingcommandcenter.data.model.Event
import Athari.marketingcommandcenter.data.model.GuestAnalytics
import Athari.marketingcommandcenter.data.model.ManagementInsight
import Athari.marketingcommandcenter.data.model.Workspace
import kotlinx.coroutines.flow.Flow

interface CampaignRepository {
    fun getCampaigns(): Flow<List<Campaign>>
    fun getCampaignById(id: String): Flow<Campaign?>
    suspend fun addCampaign(campaign: Campaign)
    suspend fun updateCampaign(campaign: Campaign)
    suspend fun deleteCampaign(id: String)

    fun getDashboardMetrics(): Flow<DashboardMetrics>
    fun getChannelPerformance(): Flow<List<ChannelPerformance>>
    fun getManagementInsights(): Flow<List<ManagementInsight>>
    fun getWorkspace(): Flow<Workspace>
    suspend fun updateWorkspace(workspace: Workspace)
    fun getGuestAnalytics(): Flow<GuestAnalytics>
    fun getEvents(): Flow<List<Event>>
}
