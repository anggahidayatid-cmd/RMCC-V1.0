package Athari.marketingcommandcenter.ui.screens.campaigns

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Add
import androidx.compose.material.icons.rounded.Analytics
import androidx.compose.material.icons.rounded.Campaign
import androidx.compose.material.icons.rounded.Clear
import androidx.compose.material.icons.rounded.Delete
import androidx.compose.material.icons.rounded.Edit
import androidx.compose.material.icons.rounded.FilterList
import androidx.compose.material.icons.rounded.MoreVert
import androidx.compose.material.icons.rounded.Refresh
import androidx.compose.material.icons.rounded.Search
import androidx.compose.material.icons.rounded.Visibility
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import Athari.marketingcommandcenter.data.model.Campaign
import Athari.marketingcommandcenter.data.model.CampaignStatus
import Athari.marketingcommandcenter.ui.theme.BorderColor
import Athari.marketingcommandcenter.ui.theme.PrimaryPurple
import Athari.marketingcommandcenter.ui.theme.SecondaryText
import Athari.marketingcommandcenter.ui.utils.formatRoas
import Athari.marketingcommandcenter.ui.utils.formatRupiah

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun CampaignListPane(
    allCampaigns: List<Campaign>,
    filteredCampaigns: List<Campaign>,
    searchQuery: String,
    onSearchQueryChange: (String) -> Unit,
    selectedStatusFilter: CampaignStatus?,
    onStatusFilterChange: (CampaignStatus?) -> Unit,
    selectedChannelFilter: String?,
    onChannelFilterChange: (String?) -> Unit,
    selectedCampaignId: String?,
    onSelectCampaign: (Campaign) -> Unit,
    onEditCampaign: (Campaign) -> Unit,
    onDeleteCampaign: (Campaign) -> Unit,
    onRefresh: () -> Unit,
    onNewCampaign: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Calculated KPI metrics across campaigns
    val totalCampaignsCount = allCampaigns.size
    val activeCampaignsCount = allCampaigns.count { it.status == CampaignStatus.ACTIVE }
    val totalPlannedBudget = allCampaigns.sumOf { it.budget }
    val totalActualSpend = allCampaigns.sumOf { it.spend }
    val totalAttributedRevenue = allCampaigns.sumOf { it.revenue }
    val blendedRoas = if (totalActualSpend > 0) totalAttributedRevenue / totalActualSpend else 0.0

    val channelsList = listOf("All", "Instagram", "TikTok", "Meta Ads", "Google", "WhatsApp", "CRM", "Offline", "Multi-channel")

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Campaign Management",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    text = "Plan, monitor, and optimize every restaurant marketing campaign",
                    style = MaterialTheme.typography.bodyMedium,
                    color = SecondaryText
                )
            }

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedButton(
                    onClick = onRefresh,
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(
                        imageVector = Icons.Rounded.Refresh,
                        contentDescription = "Refresh",
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Refresh")
                }

                Button(
                    onClick = onNewCampaign,
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryPurple),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(
                        imageVector = Icons.Rounded.Add,
                        contentDescription = "New Campaign",
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("+ New Campaign")
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Top KPI Cards
        FlowRow(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            maxItemsInEachRow = 3
        ) {
            KpiCard(
                label = "Total Campaigns",
                value = "$totalCampaignsCount",
                subtitle = "$activeCampaignsCount Active currently",
                modifier = Modifier.weight(1f)
            )
            KpiCard(
                label = "Active Campaigns",
                value = "$activeCampaignsCount",
                subtitle = "Running promotions",
                modifier = Modifier.weight(1f)
            )
            KpiCard(
                label = "Total Planned Budget",
                value = formatRupiah(totalPlannedBudget),
                subtitle = "Approved allocation",
                modifier = Modifier.weight(1f)
            )
            KpiCard(
                label = "Actual Spend",
                value = formatRupiah(totalActualSpend),
                subtitle = "${if (totalPlannedBudget > 0) (totalActualSpend / totalPlannedBudget * 100).toInt() else 0}% of total budget",
                modifier = Modifier.weight(1f)
            )
            KpiCard(
                label = "Attributed Revenue",
                value = formatRupiah(totalAttributedRevenue),
                subtitle = "Tracked ROI revenue",
                modifier = Modifier.weight(1f)
            )
            KpiCard(
                label = "Blended ROAS",
                value = formatRoas(blendedRoas),
                subtitle = "Revenue ÷ Spend",
                isHighlight = true,
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Search & Filter Bar
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            shape = RoundedCornerShape(16.dp),
            elevation = CardDefaults.cardElevation(1.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                // Search Field
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = onSearchQueryChange,
                    placeholder = { Text("Search by campaign name, code, objective, or channel...") },
                    leadingIcon = {
                        Icon(imageVector = Icons.Rounded.Search, contentDescription = "Search", tint = SecondaryText)
                    },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { onSearchQueryChange("") }) {
                                Icon(imageVector = Icons.Rounded.Clear, contentDescription = "Clear")
                            }
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp)
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Status Filter Chips
                Text(
                    text = "Filter by Status:",
                    style = MaterialTheme.typography.labelSmall,
                    color = SecondaryText,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    FilterChip(
                        selected = selectedStatusFilter == null,
                        onClick = { onStatusFilterChange(null) },
                        label = { Text("All Statuses") },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = PrimaryPurple.copy(alpha = 0.15f),
                            selectedLabelColor = PrimaryPurple
                        )
                    )

                    CampaignStatus.entries.forEach { status ->
                        FilterChip(
                            selected = selectedStatusFilter == status,
                            onClick = { onStatusFilterChange(if (selectedStatusFilter == status) null else status) },
                            label = { Text(status.displayName) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = PrimaryPurple.copy(alpha = 0.15f),
                                selectedLabelColor = PrimaryPurple
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Channel Filter Chips
                Text(
                    text = "Filter by Channel:",
                    style = MaterialTheme.typography.labelSmall,
                    color = SecondaryText,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    channelsList.forEach { ch ->
                        val isSelected = (ch == "All" && selectedChannelFilter.isNullOrBlank()) || selectedChannelFilter == ch
                        FilterChip(
                            selected = isSelected,
                            onClick = {
                                if (ch == "All") onChannelFilterChange(null) else onChannelFilterChange(ch)
                            },
                            label = { Text(ch) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = PrimaryPurple.copy(alpha = 0.15f),
                                selectedLabelColor = PrimaryPurple
                            )
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Campaign List / Table View
        if (filteredCampaigns.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(220.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(MaterialTheme.colorScheme.surface),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Rounded.FilterList,
                        contentDescription = null,
                        tint = SecondaryText,
                        modifier = Modifier.size(48.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "No campaigns found matching your criteria",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = SecondaryText
                    )
                    Text(
                        text = "Try adjusting your search query or status/channel filters.",
                        style = MaterialTheme.typography.bodySmall,
                        color = SecondaryText
                    )
                }
            }
        } else {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                filteredCampaigns.forEach { campaign ->
                    val isSelected = selectedCampaignId == campaign.id
                    CampaignCardItem(
                        campaign = campaign,
                        isSelected = isSelected,
                        onClick = { onSelectCampaign(campaign) },
                        onViewDetails = { onSelectCampaign(campaign) },
                        onEdit = { onEditCampaign(campaign) },
                        onDelete = { onDeleteCampaign(campaign) }
                    )
                }
            }
        }
    }
}

@Composable
private fun KpiCard(
    label: String,
    value: String,
    subtitle: String,
    isHighlight: Boolean = false,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(
            containerColor = if (isHighlight) PrimaryPurple.copy(alpha = 0.12f) else MaterialTheme.colorScheme.surface
        ),
        shape = RoundedCornerShape(14.dp),
        elevation = CardDefaults.cardElevation(1.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(
                text = label,
                style = MaterialTheme.typography.labelMedium,
                color = if (isHighlight) PrimaryPurple else SecondaryText,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = if (isHighlight) PrimaryPurple else MaterialTheme.colorScheme.onSurface,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = SecondaryText,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
private fun CampaignCardItem(
    campaign: Campaign,
    isSelected: Boolean,
    onClick: () -> Unit,
    onViewDetails: () -> Unit,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    var menuExpanded by remember { mutableStateOf(false) }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) PrimaryPurple.copy(alpha = 0.08f) else MaterialTheme.colorScheme.surface
        ),
        shape = RoundedCornerShape(16.dp),
        border = if (isSelected) androidx.compose.foundation.BorderStroke(2.dp, PrimaryPurple) else androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header Row: Name & Code + Status Pill + Menu
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = campaign.name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = campaign.code,
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = PrimaryPurple
                        )
                        Text(
                            text = " • ${campaign.channel}",
                            style = MaterialTheme.typography.bodySmall,
                            color = SecondaryText
                        )
                        Text(
                            text = " • ${campaign.startDate} - ${campaign.endDate}",
                            style = MaterialTheme.typography.bodySmall,
                            color = SecondaryText
                        )
                    }
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    CampaignStatusPill(status = campaign.status)

                    Box {
                        IconButton(onClick = { menuExpanded = true }) {
                            Icon(imageVector = Icons.Rounded.MoreVert, contentDescription = "Actions")
                        }

                        DropdownMenu(
                            expanded = menuExpanded,
                            onDismissRequest = { menuExpanded = false }
                        ) {
                            DropdownMenuItem(
                                text = { Text("View Details") },
                                onClick = {
                                    menuExpanded = false
                                    onViewDetails()
                                },
                                leadingIcon = { Icon(imageVector = Icons.Rounded.Visibility, contentDescription = null) }
                            )
                            DropdownMenuItem(
                                text = { Text("Edit Campaign") },
                                onClick = {
                                    menuExpanded = false
                                    onEdit()
                                },
                                leadingIcon = { Icon(imageVector = Icons.Rounded.Edit, contentDescription = null) }
                            )
                            HorizontalDivider()
                            DropdownMenuItem(
                                text = { Text("Delete", color = Color.Red) },
                                onClick = {
                                    menuExpanded = false
                                    onDelete()
                                },
                                leadingIcon = { Icon(imageVector = Icons.Rounded.Delete, contentDescription = null, tint = Color.Red) }
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))
            HorizontalDivider(color = BorderColor)
            Spacer(modifier = Modifier.height(12.dp))

            // Financial & Metrics Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text("Planned Budget", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                    Text(formatRupiah(campaign.budget), style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                }

                Column {
                    Text("Actual Spend", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                    Text(formatRupiah(campaign.spend), style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                }

                Column {
                    Text("Attributed Revenue", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                    Text(formatRupiah(campaign.revenue), style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                }

                Column {
                    Text("ROAS", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                    Text(
                        formatRoas(campaign.roas),
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold,
                        color = PrimaryPurple
                    )
                }
            }
        }
    }
}
