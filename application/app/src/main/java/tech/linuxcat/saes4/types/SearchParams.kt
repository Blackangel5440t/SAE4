package tech.linuxcat.saes4.types

import android.os.Parcel
import android.os.Parcelable
import java.time.LocalDate

class SearchParams(var villeDepart : String, var villeArrivee : String, var dateDepart : LocalDate) : android.os.Parcelable{
    constructor(parcel: Parcel?) : this(
        parcel!!.readString().toString(),
        parcel.readString().toString(),
        LocalDate.ofEpochDay(parcel.readLong())
    )

    companion object CREATOR : Parcelable.Creator<SearchParams>{
        override fun createFromParcel(source: Parcel?): SearchParams {
            return SearchParams(source)
        }

        override fun newArray(size: Int): Array<SearchParams?> {
            return arrayOfNulls<SearchParams>(size)
        }
    }

    override fun describeContents(): Int {
        return 0
    }

    override fun writeToParcel(dest: Parcel, flags: Int) {
        dest.writeString(villeDepart)
        dest.writeString(villeArrivee)
        dest.writeLong(dateDepart.toEpochDay())
    }
}