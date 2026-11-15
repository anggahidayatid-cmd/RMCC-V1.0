package Athari.marketingcommandcenter.ui.screens.campaigns

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Analytics
import androidx.compose.material.icons.rounded.CalendarToday
import androidx.compose.material.icons.rounded.Campaign
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.MonetizationOn
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuAnchorType
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import Athari.marketingcommandcenter.data.model.Campaign
import Athari.marketingcommandcenter.data.model.CampaignStatus
import Athari.marketingcommandcenter.data.model.CampaignType
import Athari.marketingcommandcenter.ui.theme.DangerRed
import Athari.marketingcommandcenter.ui.theme.PrimaryPurple
import Athari.marketingcommandcenter.ui.utils.formatRoas
import java.text.SimpleDateFormat
import java.util.Locale

private fun sanitizeDecimalInput(input: String): String {
    val filtered = input.filter { it.isDigit() || it == '.' }
    val parts = filtered.split('.')
    return if (parts.size > 1) {
        parts[0] + "." + parts.drop(1).joinToString("")
    } else {
        filtered
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CampaignFormDialog(
    campaignToEdit: Campaign? = null,
    onSave: (Campaign) -> Unit,
    onDismiss: () -> Unit
) {
    val isEdit = campaignToEdit != null

    var name by remember { mutableStateOf(campaignToEdit?.name ?: "") }
    var code by remember { mutableStateOf(campaignToEdit?.code ?: "") }
    var objective by remember { mutableStateOf(campaignToEdit?.objective ?: "") }
    var type by remember { mutableStateOf(campaignToEdit?.type ?: CampaignType.PROMOTION) }
    var channel by remember { mutableStateOf(campaignToEdit?.channel ?: "Instagram") }

    var startDate by remember { mutableStateOf(campaignToEdit?.startDate ?: "1 Oct 2026") }
    var endDate by remember { mutableStateOf(campaignToEdit?.endDate ?: "31 Oct 2026") }
    var status by remember { mutableStateOf(campaignToEdit?.status ?: CampaignStatus.ACTIVE) }

    var budgetText by remember { mutableStateOf(campaignToEdit?.budget?.toLong()?.toString() ?: "10000000") }
    var dailyBudgetText by remember { mutableStateOf(campaignToEdit?.dailyBudget?.toLong()?.toString() ?: "300000") }
    var targetRoasText by remember { mutableStateOf(campaignToEdit?.targetRoas?.toString() ?: "4.5") }
    var targetRevenueText by remember { mutableStateOf(campaignToEdit?.targetRevenue?.toLong()?.toString() ?: "45000000") }
    var reservationTargetText by remember { mutableStateOf(campaignToEdit?.reservationTarget?.toString() ?: "100") }
    var guestTargetText by remember { mutableStateOf(campaignToEdit?.guestTarget?.toString() ?: "400") }

    var spendText by remember { mutableStateOf(campaignToEdit?.spend?.toLong()?.toString() ?: "0") }
    var revenueText by remember { mutableStateOf(campaignToEdit?.revenue?.toLong()?.toString() ?: "0") }

    var nameError by remember { mutableStateOf(false) }
    var codeError by remember { mutableStateOf(false) }
    var dateValidationError by remember { mutableStateOf<String?>(null) }

    // Dropdown expanded states
    var typeExpanded by remember { mutableStateOf(false) }
    var statusExpanded by remember { mutableStateOf(false) }
    var channelExpanded by remember { mutableStateOf(false) }

    val channelOptions = listOf("Instagram", "TikTok", "Meta Ads", "Google", "WhatsApp", "CRM", "Offline", "Multi-channel")

    // Calculated ROAS
    val spendVal = spendText.toDoubleOrNull() ?: 0.0
    val revenueVal = revenueText.toDoubleOrNull() ?: 0.0
    val autoRoas = if (spendVal > 0) revenueVal / spendVal else 0.0

    fun validateDates(): Boolean {
        // Date validation check
        dateValidationError = null
        if (startDate.isBlank() || endDate.isBlank()) {
            dateValidationError = "Start date and End date cannot be empty."
            return false
        }
        // Try parsing common formats
        val formats = listOf("dd MMM yyyy", "d MMM yyyy", "yyyy-MM-dd", "dd/MM/yyyy")
        var startMillis: Long? = null
        var endMillis: Long? = null

        for (fmt in formats) {
            val sdf = SimpleDateFormat(fmt, Locale.ENGLISH)
            try {
                if (startMillis == null) startMillis = sdf.parse(startDate)?.time
                if (endMillis == null) endMillis = sdf.parse(endDate)?.time
            } catch (_: Exception) { }
        }

        if (startMillis != null && endMillis != null && endMillis < startMillis) {
            dateValidationError = "End date must be on or after start date."
            return false
        }
        return true
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .padding(vertical = 16.dp),
            shape = RoundedCornerShape(20.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .padding(24.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Rounded.Campaign,
                            contentDescription = null,
                            tint = PrimaryPurple,
                            modifier = Modifier.padding(end = 8.dp)
                        )
                        Text(
                            text = if (isEdit) "Edit Campaign" else "New Campaign",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(imageVector = Icons.Rounded.Close, contentDescription = "Close")
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Section 1: Basic Info
                Text(
                    text = "Basic Information",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = PrimaryPurple
                )
                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = name,
                    onValueChange = {
                        name = it
                        if (it.isNotBlank()) nameError = false
                    },
                    label = { Text("Campaign Name *") },
                    isError = nameError,
                    supportingText = if (nameError) { { Text("Name is required") } } else null,
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = code,
                        onValueChange = {
                            code = it
                            if (it.isNotBlank()) codeError = false
                        },
                        label = { Text("Campaign Code *") },
                        isError = codeError,
                        supportingText = if (codeError) { { Text("Code required") } } else null,
                        modifier = Modifier.weight(1f),
                        singleLine = true
                    )

                    // Type Dropdown
                    ExposedDropdownMenuBox(
                        expanded = typeExpanded,
                        onExpandedChange = { typeExpanded = it },
                        modifier = Modifier.weight(1f)
                    ) {
                        OutlinedTextField(
                            value = type.displayName,
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Type") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = typeExpanded) },
                            modifier = Modifier.menuAnchor(ExposedDropdownMenuAnchorType.PrimaryNotEditable, true)
                        )
                        ExposedDropdownMenu(
                            expanded = typeExpanded,
                            onDismissRequest = { typeExpanded = false }
                        ) {
                            CampaignType.entries.forEach { item ->
                                DropdownMenuItem(
                                    text = { Text(item.displayName) },
                                    onClick = {
                                        type = item
                                        typeExpanded = false
                                    }
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Channel Dropdown/Field
                ExposedDropdownMenuBox(
                    expanded = channelExpanded,
                    onExpandedChange = { channelExpanded = it },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    OutlinedTextField(
                        value = channel,
                        onValueChange = { channel = it },
                        label = { Text("Marketing Channel") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = channelExpanded) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .menuAnchor(ExposedDropdownMenuAnchorType.PrimaryEditable, true)
                    )
                    ExposedDropdownMenu(
                        expanded = channelExpanded,
                        onDismissRequest = { channelExpanded = false }
                    ) {
                        channelOptions.forEach { option ->
                            DropdownMenuItem(
                                text = { Text(option) },
                                onClick = {
                                    channel = option
                                    channelExpanded = false
                                }
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = objective,
                    onValueChange = { objective = it },
                    label = { Text("Campaign Objective / Description") },
                    modifier = Modifier.fillMaxWidth(),
                    maxLines = 3
                )

                Spacer(modifier = Modifier.height(20.dp))

                // Section 2: Schedule & Status
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Rounded.CalendarToday,
                        contentDescription = null,
                        tint = PrimaryPurple,
                        modifier = Modifier.padding(end = 6.dp)
                    )
                    Text(
                        text = "Schedule & Status",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = PrimaryPurple
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = startDate,
                        onValueChange = { startDate = it },
                        label = { Text("Start Date") },
                        placeholder = { Text("e.g. 1 Oct 2026") },
                        modifier = Modifier.weight(1f),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = endDate,
                        onValueChange = { endDate = it },
                        label = { Text("End Date") },
                        placeholder = { Text("e.g. 31 Oct 2026") },
                        modifier = Modifier.weight(1f),
                        singleLine = true
                    )
                }

                if (dateValidationError != null) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = dateValidationError!!,
                        color = DangerRed,
                        style = MaterialTheme.typography.bodySmall
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Status Dropdown
                ExposedDropdownMenuBox(
                    expanded = statusExpanded,
                    onExpandedChange = { statusExpanded = it },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    OutlinedTextField(
                        value = status.displayName,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Campaign Status") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = statusExpanded) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .menuAnchor(ExposedDropdownMenuAnchorType.PrimaryNotEditable, true)
                    )
                    ExposedDropdownMenu(
                        expanded = statusExpanded,
                        onDismissRequest = { statusExpanded = false }
                    ) {
                        CampaignStatus.entries.forEach { item ->
                            DropdownMenuItem(
                                text = { Text(item.displayName) },
                                onClick = {
                                    status = item
                                    statusExpanded = false
                                }
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Section 3: Budget & Targets
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Rounded.MonetizationOn,
                        contentDescription = null,
                        tint = PrimaryPurple,
                        modifier = Modifier.padding(end = 6.dp)
                    )
                    Text(
                        text = "Budget & Targets",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = PrimaryPurple
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = budgetText,
                        onValueChange = { budgetText = it.filter { c -> c.isDigit() } },
                        label = { Text("Planned Budget (Rp)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = dailyBudgetText,
                        onValueChange = { dailyBudgetText = it.filter { c -> c.isDigit() } },
                        label = { Text("Daily Budget (Rp)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f),
                        singleLine = true
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = targetRoasText,
                        onValueChange = { targetRoasText = sanitizeDecimalInput(it) },
                        label = { Text("Target ROAS (x)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        modifier = Modifier.weight(1f),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = targetRevenueText,
                        onValueChange = { targetRevenueText = it.filter { c -> c.isDigit() } },
                        label = { Text("Target Revenue (Rp)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f),
                        singleLine = true
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = reservationTargetText,
                        onValueChange = { reservationTargetText = it.filter { c -> c.isDigit() } },
                        label = { Text("Reservation Target") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = guestTargetText,
                        onValueChange = { guestTargetText = it.filter { c -> c.isDigit() } },
                        label = { Text("Guest Target") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f),
                        singleLine = true
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Section 4: Performance & Auto-calculated ROAS
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Rounded.Analytics,
                        contentDescription = null,
                        tint = PrimaryPurple,
                        modifier = Modifier.padding(end = 6.dp)
                    )
                    Text(
                        text = "Performance & Manual Entry",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = PrimaryPurple
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = spendText,
                        onValueChange = { spendText = it.filter { c -> c.isDigit() } },
                        label = { Text("Actual Spend (Rp)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = revenueText,
                        onValueChange = { revenueText = it.filter { c -> c.isDigit() } },
                        label = { Text("Attributed Revenue (Manual Entry)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f),
                        singleLine = true
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Auto-Calculated ROAS Display
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = PrimaryPurple.copy(alpha = 0.08f)
                    ),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Auto-Calculated ROAS (Read-Only)",
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = PrimaryPurple
                            )
                            Text(
                                text = "Formula: Attributed Revenue ÷ Actual Spend",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        Text(
                            text = formatRoas(autoRoas),
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.ExtraBold,
                            color = PrimaryPurple
                        )
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextButton(onClick = onDismiss) {
                        Text("Cancel")
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Button(
                        onClick = {
                            var valid = true
                            if (name.isBlank()) {
                                nameError = true
                                valid = false
                            }
                            if (code.isBlank()) {
                                codeError = true
                                valid = false
                            }
                            if (!validateDates()) {
                                valid = false
                            }

                            if (valid) {
                                val campaign = Campaign(
                                    id = campaignToEdit?.id ?: java.util.UUID.randomUUID().toString(),
                                    restaurantId = campaignToEdit?.restaurantId ?: "REST-001",
                                    name = name.trim(),
                                    code = code.trim().uppercase(),
                                    objective = objective.trim(),
                                    type = type,
                                    channel = channel.ifBlank { "Multi-channel" },
                                    startDate = startDate.trim(),
                                    endDate = endDate.trim(),
                                    budget = budgetText.toDoubleOrNull() ?: 0.0,
                                    dailyBudget = dailyBudgetText.toDoubleOrNull() ?: 0.0,
                                    targetRoas = targetRoasText.toDoubleOrNull() ?: 4.0,
                                    targetRevenue = targetRevenueText.toDoubleOrNull() ?: 0.0,
                                    reservationTarget = reservationTargetText.toIntOrNull() ?: 0,
                                    guestTarget = guestTargetText.toIntOrNull() ?: 0,
                                    spend = spendText.toDoubleOrNull() ?: 0.0,
                                    revenue = revenueText.toDoubleOrNull() ?: 0.0,
                                    status = status,
                                    notes = campaignToEdit?.notes ?: ""
                                )
                                onSave(campaign)
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryPurple)
                    ) {
                        Text(if (isEdit) "Update Campaign" else "Save Campaign")
                    }
                }
            }
        }
    }
}
