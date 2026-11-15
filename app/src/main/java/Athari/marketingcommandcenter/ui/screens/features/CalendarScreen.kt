package Athari.marketingcommandcenter.ui.screens.features

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.rounded.Add
import androidx.compose.material.icons.rounded.CalendarMonth
import androidx.compose.material.icons.rounded.ChevronLeft
import androidx.compose.material.icons.rounded.ChevronRight
import androidx.compose.material.icons.rounded.Event
import androidx.compose.material.icons.rounded.Group
import androidx.compose.material.icons.rounded.MusicNote
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
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
import androidx.compose.ui.text.style.TextAlign
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
import Athari.marketingcommandcenter.ui.viewmodel.DashboardViewModel
import kotlinx.coroutines.launch

data class CalendarEventItem(
    val id: String,
    val name: String,
    val date: String,
    val dayOfMonth: Int,
    val linkedCampaign: String,
    val expectedGuests: Int,
    val actualGuests: Int,
    val status: String, // Completed, Active, Upcoming, Draft
    val category: String // Live Music, Promotion, Seasonal, Special Event
)

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun CalendarScreen(
    viewModel: DashboardViewModel,
    modifier: Modifier = Modifier
) {
    var selectedEvent by remember { mutableStateOf<CalendarEventItem?>(null) }
    var showEventModal by remember { mutableStateOf(false) }

    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    val sampleEvents = listOf(
        CalendarEventItem("EVT-001", "Friday Acoustic Night", "17 Oct 2026", 17, "Live Music October", 150, 165, "Completed", "Live Music"),
        CalendarEventItem("EVT-002", "Saturday Jazz Showcase", "24 Oct 2026", 24, "Live Music October", 180, 0, "Upcoming", "Live Music"),
        CalendarEventItem("EVT-003", "Weekend Family Feast Bundle", "1-31 Oct 2026", 1, "Weekend Family", 480, 390, "Active", "Promotion"),
        CalendarEventItem("EVT-004", "Halloween Special Tasting Menu", "31 Oct 2026", 31, "Seasonal Spooktacular", 120, 0, "Draft", "Seasonal"),
        CalendarEventItem("EVT-005", "Chef's Table Wine Pairing", "12 Oct 2026", 12, "VIP Dinner Series", 40, 42, "Completed", "Special Event")
    )

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
                        text = "Marketing & Event Calendar",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = "Schedule promotions, acoustic live music, chef specials, and marketing campaign milestones",
                        style = MaterialTheme.typography.bodyMedium,
                        color = SecondaryText
                    )
                }

                Button(
                    onClick = {
                        scope.launch {
                            snackbarHostState.showSnackbar("Create Event dialog opened")
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryPurple),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(imageVector = Icons.Rounded.Add, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("+ Schedule Event")
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Calendar Month Navigation Card & Grid Preview
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(2.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    // Month Header
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Rounded.CalendarMonth, contentDescription = null, tint = PrimaryPurple)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "October 2026",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Row {
                            IconButton(onClick = {}) { Icon(imageVector = Icons.Rounded.ChevronLeft, contentDescription = "Prev") }
                            IconButton(onClick = {}) { Icon(imageVector = Icons.Rounded.ChevronRight, contentDescription = "Next") }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))
                    HorizontalDivider(color = BorderColor)
                    Spacer(modifier = Modifier.height(16.dp))

                    // Days of Week Header
                    val daysOfWeek = listOf("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        daysOfWeek.forEach { day ->
                            Text(
                                text = day,
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = SecondaryText,
                                modifier = Modifier.weight(1f),
                                textAlign = TextAlign.Center
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Month Grid Cells Simulation (31 Days)
                    FlowRow(
                        modifier = Modifier.fillMaxWidth(),
                        maxItemsInEachRow = 7,
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        // Oct 1 starts on Thursday (index 3)
                        repeat(3) {
                            Box(modifier = Modifier.weight(1f).height(64.dp))
                        }

                        for (day in 1..31) {
                            val eventOnDay = sampleEvents.find { it.dayOfMonth == day }
                            CalendarDayCell(
                                dayNumber = day,
                                event = eventOnDay,
                                onClick = {
                                    if (eventOnDay != null) {
                                        selectedEvent = eventOnDay
                                        showEventModal = true
                                    }
                                },
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Events List / Agenda
            Text(
                text = "October Events & Milestones Agenda",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
            Spacer(modifier = Modifier.height(12.dp))

            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                sampleEvents.forEach { event ->
                    EventCardItem(
                        event = event,
                        onClick = {
                            selectedEvent = event
                            showEventModal = true
                        }
                    )
                }
            }
        }

        SnackbarHost(
            hostState = snackbarHostState,
            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }

    // Modal Event Detail Preview
    if (showEventModal && selectedEvent != null) {
        val evt = selectedEvent!!
        AlertDialog(
            onDismissRequest = { showEventModal = false },
            icon = { Icon(imageVector = Icons.Rounded.Event, contentDescription = null, tint = PrimaryPurple) },
            title = { Text(evt.name) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Date: ${evt.date}", fontWeight = FontWeight.Bold)
                    Text("Linked Campaign: ${evt.linkedCampaign}")
                    Text("Category: ${evt.category}")
                    Text("Expected Attendance: ${evt.expectedGuests} guests")
                    if (evt.actualGuests > 0) {
                        Text("Actual Guests Turned Up: ${evt.actualGuests} guests (${(evt.actualGuests.toFloat() / evt.expectedGuests * 100).toInt()}% occupancy)", fontWeight = FontWeight.SemiBold, color = SuccessGreen)
                    }
                    HorizontalDivider()
                    Text("Status: ${evt.status}", style = MaterialTheme.typography.labelMedium, fontWeight = FontWeight.Bold, color = PrimaryPurple)
                }
            },
            confirmButton = {
                Button(
                    onClick = { showEventModal = false },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryPurple)
                ) {
                    Text("Close")
                }
            }
        )
    }
}

@Composable
private fun CalendarDayCell(
    dayNumber: Int,
    event: CalendarEventItem?,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .height(64.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(
                if (event != null) PrimaryPurple.copy(alpha = 0.1f) else MaterialTheme.colorScheme.surface
            )
            .border(
                width = 1.dp,
                color = if (event != null) PrimaryPurple.copy(alpha = 0.4f) else BorderColor,
                shape = RoundedCornerShape(8.dp)
            )
            .then(if (event != null) Modifier.clickable { onClick() } else Modifier)
            .padding(4.dp),
        contentAlignment = Alignment.TopStart
    ) {
        Column {
            Text(
                text = dayNumber.toString(),
                style = MaterialTheme.typography.labelSmall,
                fontWeight = if (event != null) FontWeight.Bold else FontWeight.Normal,
                color = if (event != null) PrimaryPurple else MaterialTheme.colorScheme.onSurface
            )

            if (event != null) {
                Spacer(modifier = Modifier.height(2.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(4.dp))
                        .background(PrimaryPurple)
                        .padding(horizontal = 4.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = event.name,
                        style = MaterialTheme.typography.labelSmall,
                        color = Color.White,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

@Composable
private fun EventCardItem(
    event: CalendarEventItem,
    onClick: () -> Unit
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
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(PrimaryPurple.copy(alpha = 0.12f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = if (event.category == "Live Music") Icons.Rounded.MusicNote else Icons.Rounded.Event,
                            contentDescription = null,
                            tint = PrimaryPurple
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(text = event.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        Text(text = "${event.date} • Linked to '${event.linkedCampaign}'", style = MaterialTheme.typography.bodySmall, color = SecondaryText)
                    }
                }

                EventStatusPill(status = event.status)
            }

            Spacer(modifier = Modifier.height(12.dp))
            HorizontalDivider(color = BorderColor)
            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Rounded.Group, contentDescription = null, tint = SecondaryText, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Expected: ${formatNumber(event.expectedGuests)} guests",
                        style = MaterialTheme.typography.bodySmall,
                        color = SecondaryText
                    )
                    if (event.actualGuests > 0) {
                        Text(
                            text = " • Actual: ${formatNumber(event.actualGuests)} guests",
                            style = MaterialTheme.typography.bodySmall,
                            fontWeight = FontWeight.Bold,
                            color = SuccessGreen
                        )
                    }
                }

                OutlinedButton(
                    onClick = onClick,
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text("View Event Details")
                }
            }
        }
    }
}

@Composable
fun EventStatusPill(
    status: String,
    modifier: Modifier = Modifier
) {
    val (bg, fg) = when (status) {
        "Completed" -> Pair(SuccessGreenContainer, SuccessGreen)
        "Active" -> Pair(PrimaryPurple.copy(alpha = 0.15f), PrimaryPurple)
        "Upcoming" -> Pair(InfoBlueContainer, InfoBlue)
        else -> Pair(WarningOrangeContainer, WarningOrange)
    }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(50))
            .background(bg)
            .padding(horizontal = 10.dp, vertical = 4.dp)
    ) {
        Text(
            text = status,
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = fg
        )
    }
}

@Preview(showBackground = true, widthDp = 1000, heightDp = 800)
@Composable
fun CalendarScreenPreview() {
    val repository = remember { CampaignRepositoryImpl() }
    val viewModel = remember { DashboardViewModel(repository) }
    MarketingCommandCenterTheme {
        CalendarScreen(viewModel = viewModel)
    }
}
