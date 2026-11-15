package Athari.marketingcommandcenter.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import Athari.marketingcommandcenter.data.model.Campaign
import Athari.marketingcommandcenter.data.model.ChannelPerformance
import Athari.marketingcommandcenter.data.model.DashboardMetrics
import Athari.marketingcommandcenter.data.model.Event
import Athari.marketingcommandcenter.data.model.GuestAnalytics
import Athari.marketingcommandcenter.data.model.ManagementInsight
import Athari.marketingcommandcenter.data.model.Workspace
import Athari.marketingcommandcenter.data.repository.CampaignRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class DashboardViewModel(
    private val repository: CampaignRepository
) : ViewModel() {

    private val _userMessage = MutableStateFlow<String?>(null)
    val userMessage: StateFlow<String?> = _userMessage.asStateFlow()

    val workspace: StateFlow<Workspace> = repository.getWorkspace()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = Workspace()
        )

    val dashboardMetrics: StateFlow<DashboardMetrics> = repository.getDashboardMetrics()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = DashboardMetrics()
        )

    val channelPerformance: StateFlow<List<ChannelPerformance>> = repository.getChannelPerformance()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    val managementInsights: StateFlow<List<ManagementInsight>> = repository.getManagementInsights()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    val guestAnalytics: StateFlow<GuestAnalytics> = repository.getGuestAnalytics()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = GuestAnalytics()
        )

    val recentCampaigns: StateFlow<List<Campaign>> = repository.getCampaigns()
        .map { list -> list.take(5) }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    val events: StateFlow<List<Event>> = repository.getEvents()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    fun updateWorkspace(updatedWorkspace: Workspace) {
        viewModelScope.launch {
            try {
                repository.updateWorkspace(updatedWorkspace)
                _userMessage.value = "Workspace details updated"
            } catch (e: Exception) {
                _userMessage.value = "Failed to update workspace: ${e.localizedMessage}"
            }
        }
    }

    fun clearUserMessage() {
        _userMessage.value = null
    }
}
