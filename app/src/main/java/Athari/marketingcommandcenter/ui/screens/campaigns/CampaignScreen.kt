package Athari.marketingcommandcenter.ui.screens.campaigns

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import Athari.marketingcommandcenter.data.model.Campaign
import Athari.marketingcommandcenter.data.repository.CampaignRepositoryImpl
import Athari.marketingcommandcenter.ui.theme.BorderColor
import Athari.marketingcommandcenter.ui.theme.MarketingCommandCenterTheme
import Athari.marketingcommandcenter.ui.viewmodel.CampaignViewModel

@Composable
fun CampaignScreen(
    viewModel: CampaignViewModel,
    modifier: Modifier = Modifier
) {
    val campaigns by viewModel.campaigns.collectAsStateWithLifecycle()
    val filteredCampaigns by viewModel.filteredCampaigns.collectAsStateWithLifecycle()
    val searchQuery by viewModel.searchQuery.collectAsStateWithLifecycle()
    val selectedStatusFilter by viewModel.selectedStatusFilter.collectAsStateWithLifecycle()
    val selectedChannelFilter by viewModel.selectedChannelFilter.collectAsStateWithLifecycle()
    val selectedCampaign by viewModel.selectedCampaign.collectAsStateWithLifecycle()
    val userMessage by viewModel.userMessage.collectAsStateWithLifecycle()

    var showFormDialog by remember { mutableStateOf(false) }
    var campaignToEdit by remember { mutableStateOf<Campaign?>(null) }
    var showDeleteDialog by remember { mutableStateOf(false) }
    var campaignToDelete by remember { mutableStateOf<Campaign?>(null) }

    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(userMessage) {
        userMessage?.let { message ->
            snackbarHostState.showSnackbar(message)
            viewModel.clearUserMessage()
        }
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        BoxWithConstraints(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            val isExpanded = maxWidth >= 840.dp

            if (isExpanded) {
                // Expanded Dual-Pane (List + Detail side-by-side)
                Row(modifier = Modifier.fillMaxSize()) {
                    CampaignListPane(
                        allCampaigns = campaigns,
                        filteredCampaigns = filteredCampaigns,
                        searchQuery = searchQuery,
                        onSearchQueryChange = { viewModel.onSearchQueryChanged(it) },
                        selectedStatusFilter = selectedStatusFilter,
                        onStatusFilterChange = { viewModel.onStatusFilterChanged(it) },
                        selectedChannelFilter = selectedChannelFilter,
                        onChannelFilterChange = { viewModel.onChannelFilterChanged(it) },
                        selectedCampaignId = selectedCampaign?.id,
                        onSelectCampaign = { campaign -> viewModel.selectCampaign(campaign.id) },
                        onEditCampaign = { campaign ->
                            campaignToEdit = campaign
                            showFormDialog = true
                        },
                        onDeleteCampaign = { campaign ->
                            campaignToDelete = campaign
                            showDeleteDialog = true
                        },
                        onRefresh = { viewModel.clearFilters() },
                        onNewCampaign = {
                            campaignToEdit = null
                            showFormDialog = true
                        },
                        modifier = Modifier.weight(1.1f)
                    )

                    Surface(
                        modifier = Modifier
                            .fillMaxHeight()
                            .weight(0.9f),
                        color = MaterialTheme.colorScheme.background,
                        border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
                    ) {
                        CampaignDetailPane(
                            campaign = selectedCampaign,
                            onClose = { viewModel.selectCampaign(null) },
                            onEditClick = { campaign ->
                                campaignToEdit = campaign
                                showFormDialog = true
                            },
                            onDeleteClick = { campaign ->
                                campaignToDelete = campaign
                                showDeleteDialog = true
                            }
                        )
                    }
                }
            } else {
                // Compact Single-Pane Mode (List OR Detail)
                if (selectedCampaign != null) {
                    CampaignDetailPane(
                        campaign = selectedCampaign,
                        onClose = { viewModel.selectCampaign(null) },
                        onEditClick = { campaign ->
                            campaignToEdit = campaign
                            showFormDialog = true
                        },
                        onDeleteClick = { campaign ->
                            campaignToDelete = campaign
                            showDeleteDialog = true
                        }
                    )
                } else {
                    CampaignListPane(
                        allCampaigns = campaigns,
                        filteredCampaigns = filteredCampaigns,
                        searchQuery = searchQuery,
                        onSearchQueryChange = { viewModel.onSearchQueryChanged(it) },
                        selectedStatusFilter = selectedStatusFilter,
                        onStatusFilterChange = { viewModel.onStatusFilterChanged(it) },
                        selectedChannelFilter = selectedChannelFilter,
                        onChannelFilterChange = { viewModel.onChannelFilterChanged(it) },
                        selectedCampaignId = null,
                        onSelectCampaign = { campaign -> viewModel.selectCampaign(campaign.id) },
                        onEditCampaign = { campaign ->
                            campaignToEdit = campaign
                            showFormDialog = true
                        },
                        onDeleteCampaign = { campaign ->
                            campaignToDelete = campaign
                            showDeleteDialog = true
                        },
                        onRefresh = { viewModel.clearFilters() },
                        onNewCampaign = {
                            campaignToEdit = null
                            showFormDialog = true
                        }
                    )
                }
            }
        }
    }

    // Modal Form Dialog (New or Edit)
    if (showFormDialog) {
        CampaignFormDialog(
            campaignToEdit = campaignToEdit,
            onSave = { campaign ->
                if (campaignToEdit != null) {
                    viewModel.updateCampaign(campaign)
                } else {
                    viewModel.addCampaign(campaign)
                }
                showFormDialog = false
                campaignToEdit = null
            },
            onDismiss = {
                showFormDialog = false
                campaignToEdit = null
            }
        )
    }

    // Modal Delete Confirmation Dialog
    if (showDeleteDialog && campaignToDelete != null) {
        DeleteCampaignDialog(
            campaign = campaignToDelete!!,
            onConfirm = {
                viewModel.deleteCampaign(campaignToDelete!!.id)
                showDeleteDialog = false
                campaignToDelete = null
            },
            onDismiss = {
                showDeleteDialog = false
                campaignToDelete = null
            }
        )
    }
}

@Preview(showBackground = true, widthDp = 1000, heightDp = 800)
@Composable
fun CampaignScreenExpandedPreview() {
    val repository = remember { CampaignRepositoryImpl() }
    val viewModel = remember { CampaignViewModel(repository) }
    MarketingCommandCenterTheme {
        CampaignScreen(viewModel = viewModel)
    }
}

@Preview(showBackground = true, widthDp = 390, heightDp = 840)
@Composable
fun CampaignScreenCompactPreview() {
    val repository = remember { CampaignRepositoryImpl() }
    val viewModel = remember { CampaignViewModel(repository) }
    MarketingCommandCenterTheme {
        CampaignScreen(viewModel = viewModel)
    }
}
