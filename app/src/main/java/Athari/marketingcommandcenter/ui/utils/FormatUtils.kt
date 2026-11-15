package Athari.marketingcommandcenter.ui.utils

import java.text.NumberFormat
import java.util.Locale

fun formatRupiah(amount: Double): String {
    val longAmount = amount.toLong()
    val formatted = NumberFormat.getIntegerInstance(Locale.forLanguageTag("id-ID")).format(longAmount)
    return "Rp$formatted"
}

fun formatRoas(roas: Double): String {
    return String.format(Locale.US, "%.2fx", roas)
}

fun formatNumber(number: Number): String {
    return NumberFormat.getIntegerInstance(Locale.forLanguageTag("id-ID")).format(number)
}
