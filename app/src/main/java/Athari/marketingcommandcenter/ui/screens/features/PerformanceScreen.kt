package Athari.marketingcommandcenter.ui.screens.features

import androidx.compose.foundation.background
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.TrendingUp
import androidx.compose.material.icons.rounded.Analytics
import androidx.compose.material.icons.rounded.BarChart
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.DateRange
import androidx.compose.material.icons.rounded.MonetizationOn
import androidx.compose.material.icons.rounded.Refresh
import androidx.compose.material.icons.rounded.Star
import androidx.compose.material.icons.rounded.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.PrimaryTabRow
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import Athari.marketingcommandcenter.data.model.ChannelPerformance
import Athari.marketingcommandcenter.data.repository.CampaignRepositoryImpl
import Athari.marketingcommandcenter.ui.theme.BorderColor
import Athari.marketingcommandcenter.ui.theme.InfoBlue
import Athari.marketingcommandcenter.ui.theme.InfoBlueContainer
import Athari.marketingcommandcenter.ui.theme.MarketingCommandCenterTheme
import Athari.marketingcommandcenter.ui.theme.PrimaryPurple
import Athari.marketingcommandcenter.ui.theme.SecondaryText
import Athari.marketingcommandcenter.ui.theme.SuccessGreen
import Athari.marketingcommandcenter.ui.theme.SuccessGreenContainer
import Athari.marketingcommandcenter.ui.theme.WarningOrange
import Athari.marketingcommandcenter.ui.theme.WarningOrangeContainer
import Athari.marketingcommandcenter.ui.utils.formatRoas
import Athari.marketingcommandcenter.ui.utils.formatRupiah
import Athari.marketingcommandcenter.ui.viewmodel.DashboardViewModel

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun PerformanceScreen(
    viewModel: DashboardViewModel,
    modifier: Modifier = Modifier
) {
    val channelPerformance by viewModel.channelPerformance.collectAsStateWithLifecycle()
    val metrics by viewModel.dashboardMetrics.collectAsStateWithLifecycle()

    var selectedPeriod by remember { mutableStateOf("October 2026") }
    var selectedAttributionModelIndex by remember { mutableIntStateOf(0) }

    val periodOptions = listOf("October 2026", "Last 30 Days", "Q4 2026", "Year to Date")
    val attributionModels = listOf(
        "Position-Based (40-20-40)",
        "Last-Touch Attribution",
        "First-Touch Attribution",
        "Linear Multi-Touch"
    )

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        // Header Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Performance & Attribution",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    text = "Channel ROAS comparison, top performer rankings, and revenue attribution",
                    style = MaterialTheme.typography.bodyMedium,
                    color = SecondaryText
                )
            }

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedButton(
                    onClick = { /* Refresh performance data */ },
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(imageVector = Icons.Rounded.Refresh, contentDescription = "Refresh", modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Refresh")
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Date Range Selector Chips
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            periodOptions.forEach { period ->
                FilterChip(
                    selected = selectedPeriod == period,
                    onClick = { selectedPeriod = period },
                    label = { Text(period) },
                    leadingIcon = { Icon(imageVector = Icons.Rounded.DateRange, contentDescription = null, modifier = Modifier.size(16.dp)) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = PrimaryPurple.copy(alpha = 0.15f),
                        selectedLabelColor = PrimaryPurple
                    )
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Top KPI Stat Bar
        FlowRow(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            maxItemsInEachRow = 4
        ) {
            PerformanceKpiBox(
                title = "Total Attributed Revenue",
                value = formatRupiah(metrics.totalRevenue),
                subtitle = "Tracked ROI revenue",
                icon = Icons.AutoMirrored.Rounded.TrendingUp,
                modifier = Modifier.weight(1f)
            )
            PerformanceKpiBox(
                title = "Blended ROAS",
                value = formatRoas(metrics.blendedRoas),
                subtitle = "Across all channels",
                icon = Icons.Rounded.Analytics,
                highlight = true,
                modifier = Modifier.weight(1f)
            )
            PerformanceKpiBox(
                title = "Top Channel",
                value = "WhatsApp (6.83x)",
                subtitle = "Highest conversion rate",
                icon = Icons.Rounded.Star,
                modifier = Modifier.weight(1f)
            )
            PerformanceKpiBox(
                title = "Tracked Reservations",
                value = "${metrics.totalReservations} Tables",
                subtitle = "${metrics.totalGuests} Guests dining",
                icon = Icons.Rounded.BarChart,
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Section 1: Channel Performance Comparison
        Text(
            text = "Channel Performance Breakdown",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground
        )
        Text(
            text = "Comparison of Spend, Revenue, and ROAS per marketing channel",
            style = MaterialTheme.typography.bodySmall,
            color = SecondaryText
        )

        Spacer(modifier = Modifier.height(12.dp))

        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            channelPerformance.forEach { item ->
                ChannelPerformanceCard(item = item)
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Section 2: Top & Underperforming Rankings
        Text(
            text = "Performance Rankings & Insights",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground
        )

        Spacer(modifier = Modifier.height(12.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Top Performer Card
            Card(
                modifier = Modifier.weight(1f),
                colors = CardDefaults.cardColors(containerColor = SuccessGreenContainer),
                shape = RoundedCornerShape(16.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, SuccessGreen.copy(alpha = 0.3f))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(imageVector = Icons.Rounded.CheckCircle, contentDescription = null, tint = SuccessGreen)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "#1 Top Performing Channel",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = SuccessGreen
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "WhatsApp Broadcast & Automation",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "ROAS: 6.83x • Spend: Rp1.200.000 • Revenue: Rp8.200.000",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Direct birthday triggers and VIP weekend reservation invites yielded highest conversion per message with low cost.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            // Underperforming Alert Card
            Card(
                modifier = Modifier.weight(1f),
                colors = CardDefaults.cardColors(containerColor = WarningOrangeContainer),
                shape = RoundedCornerShape(16.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, WarningOrange.copy(alpha = 0.3f))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(imageVector = Icons.Rounded.Warning, contentDescription = null, tint = WarningOrange)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Requires Optimization",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = WarningOrange
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "General Email & Legacy CRM",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "ROAS: 2.50x • Spend: Rp800.000 • Revenue: Rp2.000.000",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "ROAS is below the target 4.0x benchmark. Recommend switching segment from broadcast emails to personalized WA offers.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Section 3: Revenue Attribution Models Preview
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            shape = RoundedCornerShape(16.dp),
            elevation = CardDefaults.cardElevation(2.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = "Revenue Attribution Model Preview",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "See how revenue credit is allocated across touchpoints for multi-channel dining journeys.",
                    style = MaterialTheme.typography.bodySmall,
                    color = SecondaryText
                )

                Spacer(modifier = Modifier.height(16.dp))

                PrimaryTabRow(selectedTabIndex = selectedAttributionModelIndex) {
                    attributionModels.forEachIndexed { index, modelName ->
                        Tab(
                            selected = selectedAttributionModelIndex == index,
                            onClick = { selectedAttributionModelIndex = index },
                            text = {
                                Text(
                                    text = modelName.split(" ").first(),
                                    fontWeight = if (selectedAttributionModelIndex == index) FontWeight.Bold else FontWeight.Medium
                                )
                            }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Active Model Breakdown Details
                val modelTitle = attributionModels[selectedAttributionModelIndex]
                val modelDesc = when (selectedAttributionModelIndex) {
                    0 -> "Position-Based: Assigns 40% credit to first discovery (e.g. IG Ad), 40% to final conversion (e.g. WA booking), and 20% distributed evenly across middle touchpoints."
                    1 -> "Last-Touch: 100% of revenue credit is assigned to the last marketing channel the diner interacted with before reserving."
                    2 -> "First-Touch: 100% of revenue credit is assigned to the channel that introduced the customer to the restaurant."
                    else -> "Linear Multi-Touch: Revenue credit is split evenly across all recorded marketing interactions in the customer journey."
                }

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(PrimaryPurple.copy(alpha = 0.08f))
                        .padding(16.dp)
                ) {
                    Column {
                        Text(
                            text = modelTitle,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = PrimaryPurple
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = modelDesc,
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Attribution Breakdown Visual List
                AttributionShareItem("Instagram Ads (Discovery)", share = 0.35f, rev = "Rp42.000.000")
                AttributionShareItem("TikTok Videos (Engagement)", share = 0.26f, rev = "Rp31.000.000")
                AttributionShareItem("Meta Ads Retargeting", share = 0.18f, rev = "Rp22.000.000")
                AttributionShareItem("Google Search (Intent)", share = 0.13f, rev = "Rp15.000.000")
                AttributionShareItem("WhatsApp Direct (Conversion)", share = 0.08f, rev = "Rp8.200.000")
            }
        }
    }
}

@Composable
private fun PerformanceKpiBox(
    title: String,
    value: String,
    subtitle: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    modifier: Modifier = Modifier,
    highlight: Boolean = false
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(
            containerColor = if (highlight) PrimaryPurple.copy(alpha = 0.12f) else MaterialTheme.colorScheme.surface
        ),
        shape = RoundedCornerShape(14.dp),
        elevation = CardDefaults.cardElevation(1.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(imageVector = icon, contentDescription = null, tint = if (highlight) PrimaryPurple else SecondaryText, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = title,
                    style = MaterialTheme.typography.labelMedium,
                    color = if (highlight) PrimaryPurple else SecondaryText,
                    fontWeight = FontWeight.SemiBold
                )
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = if (highlight) PrimaryPurple else MaterialTheme.colorScheme.onSurface,
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
private fun ChannelPerformanceCard(item: ChannelPerformance) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(14.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(PrimaryPurple.copy(alpha = 0.12f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = item.channel.take(2).uppercase(),
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.Bold,
                            color = PrimaryPurple
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = item.channel,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "${item.reservations} Tables • ${item.guests} Guests",
                            style = MaterialTheme.typography.bodySmall,
                            color = SecondaryText
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(
                            if (item.roas >= 4.0) SuccessGreenContainer else WarningOrangeContainer
                        )
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "ROAS ${formatRoas(item.roas)}",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = if (item.roas >= 4.0) SuccessGreen else WarningOrange
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))
            HorizontalDivider(color = BorderColor)
            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text("Spend Allocation", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                    Text(formatRupiah(item.spend), style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                }

                Column {
                    Text("Attributed Revenue", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                    Text(formatRupiah(item.revenue), style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                }

                Column {
                    Text("ROAS Multiplier", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                    Text(formatRoas(item.roas), style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold, color = PrimaryPurple)
                }
            }
        }
    }
}

@Composable
private fun AttributionShareItem(channelName: String, share: Float, rev: String) {
    Column(modifier = Modifier.padding(vertical = 4.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(text = channelName, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
            Text(text = "$rev (${(share * 100).toInt()}%)", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
        }
        Spacer(modifier = Modifier.height(4.dp))
        LinearProgressIndicator(
            progress = { share },
            modifier = Modifier
                .fillMaxWidth()
                .height(8.dp)
                .clip(RoundedCornerShape(50)),
            color = PrimaryPurple,
            trackColor = PrimaryPurple.copy(alpha = 0.15f)
        )
    }
}

@Preview(showBackground = true, widthDp = 1000, heightDp = 800)
@Composable
fun PerformanceScreenPreview() {
    val repository = remember { CampaignRepositoryImpl() }
    val viewModel = remember { DashboardViewModel(repository) }
    MarketingCommandCenterTheme {
        PerformanceScreen(viewModel = viewModel)
    }
}
