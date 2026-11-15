package Athari.marketingcommandcenter.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import Athari.marketingcommandcenter.data.model.Campaign
import Athari.marketingcommandcenter.data.model.CampaignStatus
import Athari.marketingcommandcenter.data.model.CampaignType
import Athari.marketingcommandcenter.data.repository.CampaignRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class CampaignViewModel(
    private val repository: CampaignRepository
) : ViewModel() {

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedTypeFilter = MutableStateFlow<CampaignType?>(null)
    val selectedTypeFilter: StateFlow<CampaignType?> = _selectedTypeFilter.asStateFlow()

    private val _selectedStatusFilter = MutableStateFlow<CampaignStatus?>(null)
    val selectedStatusFilter: StateFlow<CampaignStatus?> = _selectedStatusFilter.asStateFlow()

    private val _selectedChannelFilter = MutableStateFlow<String?>(null)
    val selectedChannelFilter: StateFlow<String?> = _selectedChannelFilter.asStateFlow()

    private val _selectedCampaignId = MutableStateFlow<String?>(null)
    val selectedCampaignId: StateFlow<String?> = _selectedCampaignId.asStateFlow()

    private val _userMessage = MutableStateFlow<String?>(null)
    val userMessage: StateFlow<String?> = _userMessage.asStateFlow()

    val campaigns: StateFlow<List<Campaign>> = repository.getCampaigns()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    val filteredCampaigns: StateFlow<List<Campaign>> = combine(
        campaigns,
        _searchQuery,
        _selectedTypeFilter,
        _selectedStatusFilter,
        _selectedChannelFilter
    ) { list, query, typeFilter, statusFilter, channelFilter ->
        list.filter { campaign ->
            val matchesQuery = query.isBlank() ||
                    campaign.name.contains(query, ignoreCase = true) ||
                    campaign.code.contains(query, ignoreCase = true) ||
                    campaign.objective.contains(query, ignoreCase = true) ||
                    campaign.channel.contains(query, ignoreCase = true) ||
                    campaign.notes.contains(query, ignoreCase = true)

            val matchesType = typeFilter == null || campaign.type == typeFilter
            val matchesStatus = statusFilter == null || campaign.status == statusFilter
            val matchesChannel = channelFilter.isNullOrBlank() ||
                    channelFilter.equals("All", ignoreCase = true) ||
                    campaign.channel.contains(channelFilter, ignoreCase = true)

            matchesQuery && matchesType && matchesStatus && matchesChannel
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    val selectedCampaign: StateFlow<Campaign?> = combine(
        campaigns,
        _selectedCampaignId
    ) { list, id ->
        list.find { it.id == id || it.code == id }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = null
    )

    fun onSearchQueryChanged(query: String) {
        _searchQuery.value = query
    }

    fun onTypeFilterChanged(type: CampaignType?) {
        _selectedTypeFilter.value = type
    }

    fun onStatusFilterChanged(status: CampaignStatus?) {
        _selectedStatusFilter.value = status
    }

    fun onChannelFilterChanged(channel: String?) {
        _selectedChannelFilter.value = channel
    }

    fun clearFilters() {
        _searchQuery.value = ""
        _selectedTypeFilter.value = null
        _selectedStatusFilter.value = null
        _selectedChannelFilter.value = null
    }

    fun selectCampaign(campaignId: String?) {
        _selectedCampaignId.value = campaignId
    }

    fun addCampaign(campaign: Campaign) {
        viewModelScope.launch {
            try {
                repository.addCampaign(campaign)
                _userMessage.value = "Campaign '${campaign.name}' added successfully"
            } catch (e: Exception) {
                _userMessage.value = "Failed to add campaign: ${e.localizedMessage}"
            }
        }
    }

    fun updateCampaign(campaign: Campaign) {
        viewModelScope.launch {
            try {
                repository.updateCampaign(campaign)
                _userMessage.value = "Campaign '${campaign.name}' updated"
            } catch (e: Exception) {
                _userMessage.value = "Failed to update campaign: ${e.localizedMessage}"
            }
        }
    }

    fun deleteCampaign(campaignId: String) {
        viewModelScope.launch {
            try {
                repository.deleteCampaign(campaignId)
                if (_selectedCampaignId.value == campaignId) {
                    _selectedCampaignId.value = null
                }
                _userMessage.value = "Campaign deleted successfully"
            } catch (e: Exception) {
                _userMessage.value = "Failed to delete campaign: ${e.localizedMessage}"
            }
        }
    }

    fun clearUserMessage() {
        _userMessage.value = null
    }
}
