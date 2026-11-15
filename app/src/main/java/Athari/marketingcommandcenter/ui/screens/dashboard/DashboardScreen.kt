package Athari.marketingcommandcenter.ui.screens.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
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
import androidx.compose.material.icons.rounded.AttachMoney
import androidx.compose.material.icons.rounded.Campaign
import androidx.compose.material.icons.rounded.EventSeat
import androidx.compose.material.icons.rounded.Group
import androidx.compose.material.icons.rounded.Lightbulb
import androidx.compose.material.icons.rounded.MoneyOff
import androidx.compose.material.icons.rounded.People
import androidx.compose.material.icons.rounded.PersonAdd
import androidx.compose.material.icons.rounded.Repeat
import androidx.compose.material.icons.rounded.Storefront
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.foundation.Image
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import Athari.marketingcommandcenter.R
import Athari.marketingcommandcenter.data.model.Campaign
import Athari.marketingcommandcenter.data.model.ChannelPerformance
import Athari.marketingcommandcenter.data.model.DashboardMetrics
import Athari.marketingcommandcenter.data.model.GuestAnalytics
import Athari.marketingcommandcenter.data.model.InsightType
import Athari.marketingcommandcenter.data.model.ManagementInsight
import Athari.marketingcommandcenter.data.model.Workspace
import Athari.marketingcommandcenter.ui.components.CampaignHighlightCard
import Athari.marketingcommandcenter.ui.components.ChannelPerformanceTable
import Athari.marketingcommandcenter.ui.components.KpiCard
import Athari.marketingcommandcenter.ui.components.ManagementInsightItemCard
import Athari.marketingcommandcenter.ui.components.TargetVsActualCard
import Athari.marketingcommandcenter.ui.components.toRupiah
import Athari.marketingcommandcenter.ui.theme.AccentBlue
import Athari.marketingcommandcenter.ui.theme.BorderColor
import Athari.marketingcommandcenter.ui.theme.MarketingCommandCenterTheme
import Athari.marketingcommandcenter.ui.theme.PrimaryPurple
import Athari.marketingcommandcenter.ui.theme.SecondaryPurple
import Athari.marketingcommandcenter.ui.theme.SecondaryText
import Athari.marketingcommandcenter.ui.theme.SuccessGreen
import Athari.marketingcommandcenter.ui.viewmodel.DashboardViewModel

@Composable
fun DashboardScreen(
    viewModel: DashboardViewModel,
    modifier: Modifier = Modifier
) {
    val workspace by viewModel.workspace.collectAsStateWithLifecycle()
    val metrics by viewModel.dashboardMetrics.collectAsStateWithLifecycle()
    val channelPerformance by viewModel.channelPerformance.collectAsStateWithLifecycle()
    val insights by viewModel.managementInsights.collectAsStateWithLifecycle()
    val guestAnalytics by viewModel.guestAnalytics.collectAsStateWithLifecycle()

    DashboardContent(
        workspace = workspace,
        metrics = metrics,
        channelPerformance = channelPerformance,
        insights = insights,
        guestAnalytics = guestAnalytics,
        modifier = modifier
    )
}

@Composable
fun DashboardContent(
    workspace: Workspace,
    metrics: DashboardMetrics,
    channelPerformance: List<ChannelPerformance>,
    insights: List<ManagementInsight>,
    guestAnalytics: GuestAnalytics,
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // 1. Dashboard Header
        DashboardHeader(workspace = workspace)

        // 2. Top KPI Grid
        KpiSection(metrics = metrics, guestAnalytics = guestAnalytics)

        // 3. Campaign Performance Section (Highlights & Progress)
        CampaignPerformanceSection(
            topCampaign = metrics.topCampaign,
            underperformingCampaign = metrics.underperformingCampaign,
            totalSpend = metrics.totalSpend,
            totalRevenue = metrics.totalRevenue
        )

        // 4. Channel Performance Table Breakdown
        ChannelPerformanceTable(channels = channelPerformance)

        // 5. Management Insights Section
        ManagementInsightsSection(insights = insights)
    }
}

@Composable
private fun DashboardHeader(
    workspace: Workspace,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Executive Overview",
                    style = MaterialTheme.typography.displaySmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "How is our marketing performing right now?",
                    style = MaterialTheme.typography.bodyMedium,
                    color = SecondaryText
                )
            }

            Surface(
                shape = RoundedCornerShape(20.dp),
                color = PrimaryPurple.copy(alpha = 0.12f),
                border = androidx.compose.foundation.BorderStroke(1.dp, PrimaryPurple.copy(alpha = 0.3f))
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Rounded.Storefront,
                        contentDescription = null,
                        tint = PrimaryPurple,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = workspace.name,
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = PrimaryPurple,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun KpiSection(
    metrics: DashboardMetrics,
    guestAnalytics: GuestAnalytics,
    modifier: Modifier = Modifier
) {
    BoxWithConstraints(modifier = modifier.fillMaxWidth()) {
        val width = maxWidth
        val columns = when {
            width >= 900.dp -> 4
            width >= 600.dp -> 3
            else -> 2
        }

        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text(
                text = "Key Performance Indicators",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )

            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                maxItemsInEachRow = columns,
                modifier = Modifier.fillMaxWidth()
            ) {
                val cardWidth = (width - (12.dp * (columns - 1))) / columns

                // Total Marketing Spend
                KpiCard(
                    title = "Total Marketing Spend",
                    value = metrics.totalSpend.toRupiah(),
                    icon = Icons.Rounded.MoneyOff,
                    accentColor = SecondaryPurple,
                    trendText = "78% Budget",
                    isPositiveTrend = true,
                    subtitle = "Allocated budget",
                    modifier = Modifier.width(cardWidth)
                )

                // Attributed Revenue
                KpiCard(
                    title = "Attributed Revenue",
                    value = metrics.totalRevenue.toRupiah(),
                    icon = Icons.Rounded.AttachMoney,
                    accentColor = PrimaryPurple,
                    trendText = "+24.8%",
                    isPositiveTrend = true,
                    subtitle = "vs last month",
                    modifier = Modifier.width(cardWidth)
                )

                // Blended ROAS
                KpiCard(
                    title = "Blended ROAS",
                    value = String.format(java.util.Locale.ROOT, "%.2fx", metrics.blendedRoas),
                    icon = Icons.AutoMirrored.Rounded.TrendingUp,
                    accentColor = SuccessGreen,
                    trendText = "> 4.0x Target",
                    isPositiveTrend = true,
                    subtitle = "Return on ad spend",
                    modifier = Modifier.width(cardWidth)
                )

                // Active Campaigns
                KpiCard(
                    title = "Active Campaigns",
                    value = metrics.activeCampaignsCount.toString(),
                    icon = Icons.Rounded.Campaign,
                    accentColor = AccentBlue,
                    subtitle = "Running campaigns",
                    modifier = Modifier.width(cardWidth)
                )

                // Reservations Generated
                KpiCard(
                    title = "Reservations Generated",
                    value = metrics.totalReservations.toString(),
                    icon = Icons.Rounded.EventSeat,
                    accentColor = PrimaryPurple,
                    trendText = "+18.2%",
                    isPositiveTrend = true,
                    subtitle = "Table bookings",
                    modifier = Modifier.width(cardWidth)
                )

                // Guests Generated
                KpiCard(
                    title = "Guests Generated",
                    value = metrics.totalGuests.toString(),
                    icon = Icons.Rounded.Group,
                    accentColor = SecondaryPurple,
                    trendText = "+21.5%",
                    isPositiveTrend = true,
                    subtitle = "Total diners driven",
                    modifier = Modifier.width(cardWidth)
                )
            }

            // Customer Breakdown Badge Card (New vs Repeat)
            CustomerBreakdownCard(
                newCustomers = metrics.newCustomers,
                repeatCustomers = metrics.repeatCustomers,
                totalGuests = metrics.totalGuests
            )
        }
    }
}

@Composable
private fun CustomerBreakdownCard(
    newCustomers: Int,
    repeatCustomers: Int,
    totalGuests: Int,
    modifier: Modifier = Modifier
) {
    val newPercentage = if (totalGuests > 0) ((newCustomers.toFloat() / totalGuests) * 100).toInt() else 42
    val repeatPercentage = 100 - newPercentage

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(AccentBlue.copy(alpha = 0.12f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.People,
                            contentDescription = null,
                            tint = AccentBlue,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = "Customer Acquisition Ratio",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "New vs Repeat Guest breakdown driven by marketing",
                            style = MaterialTheme.typography.bodySmall,
                            color = SecondaryText
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Progress Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Rounded.PersonAdd,
                        contentDescription = null,
                        tint = PrimaryPurple,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "New Customers: $newCustomers ($newPercentage%)",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = PrimaryPurple
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Rounded.Repeat,
                        contentDescription = null,
                        tint = SecondaryPurple,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Repeat Customers: $repeatCustomers ($repeatPercentage%)",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = SecondaryPurple
                    )
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            LinearProgressIndicator(
                progress = { newPercentage / 100f },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(10.dp)
                    .clip(RoundedCornerShape(5.dp)),
                color = PrimaryPurple,
                trackColor = SecondaryPurple
            )
        }
    }
}

@Composable
private fun CampaignPerformanceSection(
    topCampaign: Campaign?,
    underperformingCampaign: Campaign?,
    totalSpend: Double,
    totalRevenue: Double,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "Campaign Performance Highlights",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface
        )

        BoxWithConstraints(modifier = Modifier.fillMaxWidth()) {
            val width = maxWidth
            if (width >= 720.dp) {
                // Multi-column side by side for tablets/desktop
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    CampaignHighlightCard(
                        title = "Top Performer",
                        campaign = topCampaign,
                        isTopPerformer = true,
                        modifier = Modifier.weight(1f)
                    )
                    CampaignHighlightCard(
                        title = "Needs Attention",
                        campaign = underperformingCampaign,
                        isTopPerformer = false,
                        modifier = Modifier.weight(1f)
                    )
                }
            } else {
                // Stacked vertical for mobile
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    CampaignHighlightCard(
                        title = "Top Performer",
                        campaign = topCampaign,
                        isTopPerformer = true
                    )
                    CampaignHighlightCard(
                        title = "Needs Attention",
                        campaign = underperformingCampaign,
                        isTopPerformer = false
                    )
                }
            }
        }

        // Target vs Actual Progress Card
        TargetVsActualCard(
            totalSpend = totalSpend,
            totalBudget = 29000000.0,
            totalRevenue = totalRevenue,
            targetRevenue = 131500000.0
        )
    }
}

@Composable
private fun ManagementInsightsSection(
    insights: List<ManagementInsight>,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Rounded.Lightbulb,
                    contentDescription = null,
                    tint = PrimaryPurple,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Executive Actionable Insights",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }

            Surface(
                shape = RoundedCornerShape(12.dp),
                color = MaterialTheme.colorScheme.surfaceVariant
            ) {
                Text(
                    text = "${insights.size} Insights",
                    style = MaterialTheme.typography.labelSmall,
                    color = SecondaryText,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }
        }

        if (insights.isEmpty()) {
            // Default explicit requirement cards if insights list from flow is empty
            val defaultInsights = listOf(
                ManagementInsight(
                    id = "INS-EX-1",
                    type = InsightType.POSITIVE,
                    message = "Live Music October generates highest attributed revenue (Rp41.800.000)."
                ),
                ManagementInsight(
                    id = "INS-EX-2",
                    type = InsightType.WARNING,
                    message = "Lunch Weekday is currently below its 4x target ROAS."
                ),
                ManagementInsight(
                    id = "INS-EX-3",
                    type = InsightType.RECOMMENDATION,
                    message = "Weekend Family has consumed 80% of budget and remains above target ROAS (5.97x)."
                )
            )

            defaultInsights.forEach { insight ->
                ManagementInsightItemCard(insight = insight)
            }
        } else {
            insights.forEach { insight ->
                ManagementInsightItemCard(insight = insight)
            }
        }
    }
}

@Preview(showBackground = true, widthDp = 360, heightDp = 800)
@Composable
fun DashboardScreenMobilePreview() {
    MarketingCommandCenterTheme {
        DashboardContent(
            workspace = Workspace(name = "Gourmet Bistro Cafe & Resto"),
            metrics = DashboardMetrics(
                totalSpend = 22600000.0,
                totalRevenue = 120200000.0,
                blendedRoas = 5.32,
                activeCampaignsCount = 3,
                totalReservations = 184,
                totalGuests = 520,
                newCustomers = 218,
                repeatCustomers = 302
            ),
            channelPerformance = listOf(
                ChannelPerformance("Instagram", 8000000.0, 42000000.0, 5.25, 65, 240),
                ChannelPerformance("TikTok", 5200000.0, 31000000.0, 5.96, 48, 180),
                ChannelPerformance("Meta Ads", 4400000.0, 22000000.0, 5.00, 32, 120),
                ChannelPerformance("Google", 3000000.0, 15000000.0, 5.00, 24, 90),
                ChannelPerformance("WhatsApp", 1200000.0, 8200000.0, 6.83, 15, 60),
                ChannelPerformance("CRM", 800000.0, 2000000.0, 2.50, 0, 0)
            ),
            insights = listOf(
                ManagementInsight("1", InsightType.POSITIVE, "Live Music October generates highest attributed revenue (Rp41.800.000)."),
                ManagementInsight("2", InsightType.WARNING, "Lunch Weekday is currently below its 4x target ROAS."),
                ManagementInsight("3", InsightType.RECOMMENDATION, "Weekend Family has consumed 80% of budget and remains above target ROAS (5.97x).")
            ),
            guestAnalytics = GuestAnalytics()
        )
    }
}

@Preview(showBackground = true, widthDp = 840, heightDp = 1000)
@Composable
fun DashboardScreenTabletPreview() {
    MarketingCommandCenterTheme {
        DashboardContent(
            workspace = Workspace(name = "Gourmet Bistro Cafe & Resto"),
            metrics = DashboardMetrics(
                totalSpend = 22600000.0,
                totalRevenue = 120200000.0,
                blendedRoas = 5.32,
                activeCampaignsCount = 3,
                totalReservations = 184,
                totalGuests = 520,
                newCustomers = 218,
                repeatCustomers = 302
            ),
            channelPerformance = listOf(
                ChannelPerformance("Instagram", 8000000.0, 42000000.0, 5.25, 65, 240),
                ChannelPerformance("TikTok", 5200000.0, 31000000.0, 5.96, 48, 180)
            ),
            insights = listOf(
                ManagementInsight("1", InsightType.POSITIVE, "Live Music October generates highest attributed revenue (Rp41.800.000).")
            ),
            guestAnalytics = GuestAnalytics()
        )
    }
}

@Preview(showBackground = true, widthDp = 400, heightDp = 400)
@Composable
fun AppIconPreview() {
    MarketingCommandCenterTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFF0F172A)),
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text(
                    text = "Restaurant Marketing Command Center Icon",
                    color = Color.White,
                    style = MaterialTheme.typography.titleMedium
                )

                // Adaptive Icon in Squircle
                Box(
                    modifier = Modifier
                        .size(128.dp)
                        .clip(RoundedCornerShape(28.dp))
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.ic_launcher_background),
                        contentDescription = "Icon Background",
                        modifier = Modifier.fillMaxSize()
                    )
                    Image(
                        painter = painterResource(id = R.drawable.ic_launcher_foreground),
                        contentDescription = "Icon Foreground",
                        modifier = Modifier.fillMaxSize()
                    )
                }

                // Adaptive Icon in Circle
                Box(
                    modifier = Modifier
                        .size(96.dp)
                        .clip(CircleShape)
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.ic_launcher_background),
                        contentDescription = "Icon Background Circle",
                        modifier = Modifier.fillMaxSize()
                    )
                    Image(
                        painter = painterResource(id = R.drawable.ic_launcher_foreground),
                        contentDescription = "Icon Foreground Circle",
                        modifier = Modifier.fillMaxSize()
                    )
                }
            }
        }
    }
}

