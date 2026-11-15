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
import androidx.compose.material.icons.automirrored.rounded.Message
import androidx.compose.material.icons.rounded.Add
import androidx.compose.material.icons.rounded.Cake
import androidx.compose.material.icons.rounded.Clear
import androidx.compose.material.icons.rounded.Email
import androidx.compose.material.icons.rounded.FilterList
import androidx.compose.material.icons.rounded.MoreVert
import androidx.compose.material.icons.rounded.Person
import androidx.compose.material.icons.rounded.Phone
import androidx.compose.material.icons.rounded.Repeat
import androidx.compose.material.icons.rounded.Search
import androidx.compose.material.icons.rounded.Star
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
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
import Athari.marketingcommandcenter.ui.utils.formatNumber
import Athari.marketingcommandcenter.ui.utils.formatRupiah
import Athari.marketingcommandcenter.ui.viewmodel.DashboardViewModel
import kotlinx.coroutines.launch

enum class CustomerSegment(val displayName: String) {
    ALL("All Diners"),
    NEW("New Diners"),
    REPEAT("Repeat Guests"),
    VIP("VIP Loyalty"),
    BIRTHDAY("Birthday Month")
}

data class CustomerRecord(
    val id: String,
    val name: String,
    val phone: String,
    val email: String,
    val segment: CustomerSegment,
    val totalVisits: Int,
    val totalSpend: Double,
    val lastVisit: String,
    val favoriteItems: String
)

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun CrmScreen(
    viewModel: DashboardViewModel,
    modifier: Modifier = Modifier
) {
    val guestAnalytics by viewModel.guestAnalytics.collectAsStateWithLifecycle()

    var searchQuery by remember { mutableStateOf("") }
    var selectedSegment by remember { mutableStateOf(CustomerSegment.ALL) }
    var selectedCustomerForPromo by remember { mutableStateOf<CustomerRecord?>(null) }
    var showSendPromoDialog by remember { mutableStateOf(false) }

    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    val sampleCustomers = listOf(
        CustomerRecord("CUST-001", "Budi Santoso", "+62 812-3456-7890", "budi.santoso@example.com", CustomerSegment.VIP, 18, 8400000.0, "2 days ago", "Wagyu Ribeye & Cabernet Wine"),
        CustomerRecord("CUST-002", "Siti Rahma", "+62 817-9876-5432", "siti.rahma@example.com", CustomerSegment.BIRTHDAY, 6, 3200000.0, "1 week ago", "Salmon Teriyaki & Green Tea Ice Cream"),
        CustomerRecord("CUST-003", "Kevin Wijaya", "+62 811-2233-4455", "kevin.w@example.com", CustomerSegment.REPEAT, 4, 1850000.0, "3 days ago", "Creamy Carbonara & Iced Lemon Tea"),
        CustomerRecord("CUST-004", "Amalia Putri", "+62 813-5566-7788", "amalia.p@example.com", CustomerSegment.NEW, 1, 650000.0, "Yesterday", "Artisan Coffee & Berry Cheesecake"),
        CustomerRecord("CUST-005", "Dewi Anggraini", "+62 819-0011-2233", "dewi.a@example.com", CustomerSegment.VIP, 22, 12100000.0, "Today", "Chef's Special Tasting Omakase"),
        CustomerRecord("CUST-006", "Rizky Pratama", "+62 815-7788-9900", "rizky.p@example.com", CustomerSegment.REPEAT, 7, 3400000.0, "4 days ago", "Truffle Fries & Craft Burger"),
        CustomerRecord("CUST-007", "Nadia Hapsari", "+62 812-4455-6677", "nadia.h@example.com", CustomerSegment.BIRTHDAY, 3, 1600000.0, "5 days ago", "Matcha Latte & Tiramisu")
    )

    val filteredCustomers = sampleCustomers.filter { customer ->
        val matchesSearch = searchQuery.isBlank() ||
                customer.name.contains(searchQuery, ignoreCase = true) ||
                customer.phone.contains(searchQuery, ignoreCase = true) ||
                customer.email.contains(searchQuery, ignoreCase = true) ||
                customer.favoriteItems.contains(searchQuery, ignoreCase = true)

        val matchesSegment = selectedSegment == CustomerSegment.ALL || customer.segment == selectedSegment
        matchesSearch && matchesSegment
    }

    Box(modifier = modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
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
                        text = "Customer Database & Audience CRM",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = "Diner profiles, Customer Lifetime Value (CLV), segmentation, and loyalty targeting",
                        style = MaterialTheme.typography.bodyMedium,
                        color = SecondaryText
                    )
                }

                Button(
                    onClick = {
                        scope.launch {
                            snackbarHostState.showSnackbar("Add Customer Dialog opened")
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryPurple),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(imageVector = Icons.Rounded.Add, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("+ Add Diner Profile")
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Top Customer Lifetime Value & Analytics KPI Cards
            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                maxItemsInEachRow = 4
            ) {
                CrmKpiCard(
                    title = "Total Diner Database",
                    value = "${formatNumber(guestAnalytics.totalGuests.ifZero(1420))} Profiles",
                    subtitle = "100% Opted-in WhatsApp/CRM",
                    icon = Icons.Rounded.Person,
                    modifier = Modifier.weight(1f)
                )
                CrmKpiCard(
                    title = "Average Diner CLV",
                    value = formatRupiah(2850000.0),
                    subtitle = "Lifetime spend / customer",
                    icon = Icons.Rounded.Star,
                    highlight = true,
                    modifier = Modifier.weight(1f)
                )
                CrmKpiCard(
                    title = "Repeat Diner Rate",
                    value = "${(guestAnalytics.guestRetentionRate * 100).toInt()}%",
                    subtitle = "58% return within 30 days",
                    icon = Icons.Rounded.Repeat,
                    modifier = Modifier.weight(1f)
                )
                CrmKpiCard(
                    title = "Birthday Diners (Oct)",
                    value = "42 Celebrants",
                    subtitle = "Automated WA campaign active",
                    icon = Icons.Rounded.Cake,
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
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        placeholder = { Text("Search by customer name, phone, email, or favorite food...") },
                        leadingIcon = { Icon(imageVector = Icons.Rounded.Search, contentDescription = "Search", tint = SecondaryText) },
                        trailingIcon = {
                            if (searchQuery.isNotEmpty()) {
                                IconButton(onClick = { searchQuery = "" }) {
                                    Icon(imageVector = Icons.Rounded.Clear, contentDescription = "Clear")
                                }
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "Filter by Customer Segment:",
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
                        CustomerSegment.entries.forEach { segment ->
                            FilterChip(
                                selected = selectedSegment == segment,
                                onClick = { selectedSegment = segment },
                                label = { Text(segment.displayName) },
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

            // Customer List Preview Cards
            Text(
                text = "Diner Profiles (${filteredCustomers.size})",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )

            Spacer(modifier = Modifier.height(12.dp))

            if (filteredCustomers.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(180.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(MaterialTheme.colorScheme.surface),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(imageVector = Icons.Rounded.FilterList, contentDescription = null, tint = SecondaryText, modifier = Modifier.size(40.dp))
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("No customers found for this filter.", style = MaterialTheme.typography.titleMedium, color = SecondaryText)
                    }
                }
            } else {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    filteredCustomers.forEach { customer ->
                        CustomerCardItem(
                            customer = customer,
                            onSendPromo = {
                                selectedCustomerForPromo = customer
                                showSendPromoDialog = true
                            }
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

    // Modal Send Custom WA Promo Dialog Simulation
    if (showSendPromoDialog && selectedCustomerForPromo != null) {
        val cust = selectedCustomerForPromo!!
        AlertDialog(
            onDismissRequest = { showSendPromoDialog = false },
            icon = { Icon(imageVector = Icons.AutoMirrored.Rounded.Message, contentDescription = null, tint = PrimaryPurple) },
            title = { Text("Send Direct WhatsApp Offer to ${cust.name}") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Target Diner: ${cust.name} (${cust.phone})", fontWeight = FontWeight.Bold)
                    Text("Segment: ${cust.segment.displayName} • Total Visits: ${cust.totalVisits} • Spend: ${formatRupiah(cust.totalSpend)}")
                    HorizontalDivider()
                    Text("Selected Campaign Offer: '20% Off Weekend Family Package & Complimentary Dessert'")
                    Text("Recipient WhatsApp template pre-filled and verified.", style = MaterialTheme.typography.bodySmall, color = SecondaryText)
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showSendPromoDialog = false
                        scope.launch {
                            snackbarHostState.showSnackbar("WhatsApp promo message sent to ${cust.name}!")
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryPurple)
                ) {
                    Text("Send WA Message")
                }
            },
            dismissButton = {
                TextButton(onClick = { showSendPromoDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}

private fun Int.ifZero(default: Int): Int = if (this == 0) default else this

@Composable
private fun CrmKpiCard(
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
private fun CustomerCardItem(
    customer: CustomerRecord,
    onSendPromo: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(16.dp),
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
                            .size(42.dp)
                            .clip(CircleShape)
                            .background(PrimaryPurple.copy(alpha = 0.12f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = customer.name.split(" ").mapNotNull { it.firstOrNull() }.take(2).joinToString(""),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = PrimaryPurple
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = customer.name,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Rounded.Phone, contentDescription = null, tint = SecondaryText, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(text = customer.phone, style = MaterialTheme.typography.bodySmall, color = SecondaryText)
                        }
                    }
                }

                CustomerSegmentBadge(segment = customer.segment)
            }

            Spacer(modifier = Modifier.height(12.dp))
            HorizontalDivider(color = BorderColor)
            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text("Total Visits", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                    Text("${customer.totalVisits} visits", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                }

                Column {
                    Text("Total Lifetime Spend", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                    Text(formatRupiah(customer.totalSpend), style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold, color = PrimaryPurple)
                }

                Column {
                    Text("Last Dining Visit", style = MaterialTheme.typography.labelSmall, color = SecondaryText)
                    Text(customer.lastVisit, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
                }
            }

            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Favorite Dish: ${customer.favoriteItems}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End
            ) {
                OutlinedButton(
                    onClick = onSendPromo,
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Icon(imageVector = Icons.AutoMirrored.Rounded.Message, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Send WA Promo")
                }
            }
        }
    }
}

@Composable
fun CustomerSegmentBadge(
    segment: CustomerSegment,
    modifier: Modifier = Modifier
) {
    val (bg, fg) = when (segment) {
        CustomerSegment.VIP -> Pair(PrimaryPurple.copy(alpha = 0.15f), PrimaryPurple)
        CustomerSegment.REPEAT -> Pair(SuccessGreenContainer, SuccessGreen)
        CustomerSegment.NEW -> Pair(InfoBlueContainer, InfoBlue)
        CustomerSegment.BIRTHDAY -> Pair(WarningOrangeContainer, WarningOrange)
        CustomerSegment.ALL -> Pair(Color.LightGray.copy(alpha = 0.3f), Color.DarkGray)
    }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(50))
            .background(bg)
            .padding(horizontal = 10.dp, vertical = 4.dp)
    ) {
        Text(
            text = segment.displayName,
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = fg
        )
    }
}

@Preview(showBackground = true, widthDp = 1000, heightDp = 800)
@Composable
fun CrmScreenPreview() {
    val repository = remember { CampaignRepositoryImpl() }
    val viewModel = remember { DashboardViewModel(repository) }
    MarketingCommandCenterTheme {
        CrmScreen(viewModel = viewModel)
    }
}
