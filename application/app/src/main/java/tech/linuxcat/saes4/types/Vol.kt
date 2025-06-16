package tech.linuxcat.saes4.types

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import java.time.LocalDateTime

/**
 * @param ville La ville d'arrivée
 * @param aeroport l'aéroport de départ
 * @param dateTime la date et heure de départ. TODO: Add documentation on date format
 */
@kotlinx.serialization.Serializable
@Parcelize
data class Vol(public var number : String, public var destination : String, public var airline : String, public var terminal : String, public var model : String, public var aeroid : String, public var heurelocale: String, public var id : Int) : Parcelable