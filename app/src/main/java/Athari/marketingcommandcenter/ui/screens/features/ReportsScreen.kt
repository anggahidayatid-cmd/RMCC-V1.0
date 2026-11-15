package Athari.marketingcommandcenter.ui.screens.features

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.material.icons.automirrored.rounded.Article
import androidx.compose.material.icons.rounded.Assessment
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.Download
import androidx.compose.material.icons.rounded.FileDownload
import androidx.compose.material.icons.rounded.PictureAsPdf
import androidx.compose.material.icons.rounded.TableChart
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import Athari.marketingcommandcenter.data.repository.CampaignRepositoryImpl
import Athari.marketingcommandcenter.ui.theme.BorderColor
import Athari.marketingcommandcenter.ui.theme.MarketingCommandCenterTheme
import Athari.marketingcommandcenter.ui.theme.PrimaryPurple
import Athari.marketingcommandcenter.ui.theme.SecondaryText
import Athari.marketingcommandcenter.ui.theme.SuccessGreen
import Athari.marketingcommandcenter.ui.theme.SuccessGreenContainer
import Athari.marketingcommandcenter.ui.utils.formatRoas
import Athari.marketingcommandcenter.ui.utils.formatRupiah
import Athari.marketingcommandcenter.ui.viewmodel.DashboardViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

data class ReportTemplateItem(
    val id: String,
    val title: String,
    val frequency: String,
    val description: String,
    val format: String, // PDF or CSV
    val lastGenerated: String
)

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ReportsScreen(
    viewModel: DashboardViewModel,
    modifier: Modifier = Modifier
) {
    val metrics by viewModel.dashboardMetrics.collectAsStateWithLifecycle()

    var isExportingPdf by remember { mutableStateOf(false) }
    var isExportingCsv by remember { mutableStateOf(false) }

    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    val reportTemplates = listOf(
        ReportTemplateItem("REP-001", "Executive Weekly Performance Summary", "Weekly", "High-level overview of spend, attributed revenue, blended ROAS, and key takeaways for owner", "PDF", "18 Oct 2026"),
        ReportTemplateItem("REP-002", "Monthly Channel ROI & ROAS Audit", "Monthly", "Granular break-down of Instagram, TikTok, Meta Ads, WhatsApp, and Google performance", "CSV", "1 Oct 2026"),
        ReportTemplateItem("REP-003", "Guest Loyalty & CRM Retention Report", "Monthly", "Diner repeat rate, birthday campaign performance, and average Customer Lifetime Value", "PDF", "15 Oct 2026"),
        ReportTemplateItem("REP-004", "Campaign Budget Allocation & Spend Variance", "Bi-Weekly", "Planned vs actual budget audit report with expense warnings and variance metrics", "CSV", "10 Oct 2026")
    )

    fun simulateExport(type: String) {
        scope.launch {
            if (type == "PDF") isExportingPdf = true else isExportingCsv = true
            delay(1500)
            if (type == "PDF") isExportingPdf = false else isExportingCsv = false
            snackbarHostState.showSnackbar("Report exported successfully as $type!")
        }
    }

    Box(modifier = modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
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
                        text = "Reports & Analytics Export",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = "Generate automated executive summaries, monthly ROI audits, and export PDF/CSV files",
                        style = MaterialTheme.typography.bodyMedium,
                        color = SecondaryText
                    )
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedButton(
                        onClick = { simulateExport("CSV") },
                        enabled = !isExportingCsv,
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        if (isExportingCsv) {
                            CircularProgressIndicator(modifier = Modifier.size(16.dp), strokeWidth = 2.dp)
                        } else {
                            Icon(imageVector = Icons.Rounded.TableChart, contentDescription = null, modifier = Modifier.size(18.dp))
                        }
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Export CSV")
                    }

                    Button(
                        onClick = { simulateExport("PDF") },
                        enabled = !isExportingPdf,
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryPurple),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        if (isExportingPdf) {
                            CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color.White, strokeWidth = 2.dp)
                        } else {
                            Icon(imageVector = Icons.Rounded.PictureAsPdf, contentDescription = null, modifier = Modifier.size(18.dp))
                        }
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Export PDF Report")
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Report Templates Grid
            Text(
                text = "Available Report Templates",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )

            Spacer(modifier = Modifier.height(12.dp))

            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                maxItemsInEachRow = 2
            ) {
                reportTemplates.forEach { template ->
                    ReportTemplateCard(
                        template = template,
                        onExportPdf = { simulateExport("PDF") },
                        onExportCsv = { simulateExport("CSV") },
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Executive Summary Document Preview Section
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(2.dp)
            ) {
                Column(modifier = Modifier.padding(24.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.AutoMirrored.Rounded.Article, contentDescription = null, tint = PrimaryPurple)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Live Report Document Preview",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(SuccessGreenContainer)
                                .padding(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "Generated • October 2026",
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = SuccessGreen
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))
                    HorizontalDivider(color = BorderColor)
                    Spacer(modifier = Modifier.height(16.dp))

                    // Simulated Executive PDF Document
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(MaterialTheme.colorScheme.background)
                            .border(1.dp, BorderColor, RoundedCornerShape(12.dp))
                            .padding(20.dp)
                    ) {
                        Text(
                            text = "GOURMET BISTRO CAFE & RESTO",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = PrimaryPurple
                        )
                        Text(
                            text = "Executive Marketing & Campaign Performance Audit",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Period: 1 Oct 2026 - 31 Oct 2026 • Prepared for Management",
                            style = MaterialTheme.typography.bodySmall,
                            color = SecondaryText
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text("Total Actual Spend", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                                Text(formatRupiah(metrics.totalSpend), style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                            }

                            Column {
                                Text("Attributed Revenue", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                                Text(formatRupiah(metrics.totalRevenue), style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = SuccessGreen)
                            }

                            Column {
                                Text("Blended ROAS", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                                Text(formatRoas(metrics.blendedRoas), style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.ExtraBold, color = PrimaryPurple)
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))
                        HorizontalDivider(color = BorderColor)
                        Spacer(modifier = Modifier.height(16.dp))

                        Text(
                            text = "Key Takeaways & Executive Summary",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "1. Blended ROAS reached 5.32x, exceeding the target benchmark of 4.0x across active campaigns.\n" +
                                    "2. Live Music October generated the highest single-campaign attributed revenue at Rp41.800.000.\n" +
                                    "3. WhatsApp automation yielded the highest channel conversion (6.83x ROAS) with minimal ad spend.\n" +
                                    "4. Recommendation: Scale Live Music event promotions into November and refresh Lunch Weekday creative assets.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }

        SnackbarHost(
            hostState = snackbarHostState,
            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }
}

@Composable
private fun ReportTemplateCard(
    template: ReportTemplateItem,
    onExportPdf: () -> Unit,
    onExportCsv: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(16.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor)
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .clip(CircleShape)
                            .background(PrimaryPurple.copy(alpha = 0.12f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = if (template.format == "PDF") Icons.Rounded.PictureAsPdf else Icons.Rounded.TableChart,
                            contentDescription = null,
                            tint = PrimaryPurple,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(text = template.title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        Text(text = "${template.frequency} • Last generated: ${template.lastGenerated}", style = MaterialTheme.typography.bodySmall, color = SecondaryText)
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))
            Text(text = template.description, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)

            Spacer(modifier = Modifier.height(14.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End
            ) {
                if (template.format == "PDF") {
                    OutlinedButton(onClick = onExportPdf, shape = RoundedCornerShape(10.dp)) {
                        Icon(imageVector = Icons.Rounded.Download, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Download PDF")
                    }
                } else {
                    OutlinedButton(onClick = onExportCsv, shape = RoundedCornerShape(10.dp)) {
                        Icon(imageVector = Icons.Rounded.FileDownload, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Download CSV")
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true, widthDp = 1000, heightDp = 800)
@Composable
fun ReportsScreenPreview() {
    val repository = remember { CampaignRepositoryImpl() }
    val viewModel = remember { DashboardViewModel(repository) }
    MarketingCommandCenterTheme {
        ReportsScreen(viewModel = viewModel)
    }
}
