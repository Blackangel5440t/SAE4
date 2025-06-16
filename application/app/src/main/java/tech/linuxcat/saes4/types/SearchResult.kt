package tech.linuxcat.saes4.types

import android.os.Parcel
import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

/**
 * Représente le résultat d'une recherche.
 */
@Parcelize
data class SearchResult(public var city : City, public var vol : Vol) : Parcelable