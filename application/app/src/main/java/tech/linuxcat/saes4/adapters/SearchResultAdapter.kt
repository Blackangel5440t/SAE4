package tech.linuxcat.saes4.adapters

import android.content.Context
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ImageView
import android.widget.TextView
import com.squareup.picasso.Picasso
import tech.linuxcat.saes4.R
import tech.linuxcat.saes4.types.SearchResult
import java.time.format.DateTimeFormatter

/**
 * Adapter pour un résultat de recherche.
 * @param context : Contexte
 * @param resource : n'a pas d'importance
 * @param objects : La liste de résultats de recherche.
 */
class SearchResultAdapter(context : Context, resource : Int, objects : List<SearchResult>) : ArrayAdapter<SearchResult>(context, resource, objects) {
    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        var v = convertView
        if (v == null) {
            val inf = LayoutInflater.from(context)
            v = inf.inflate(R.layout.search_result, parent, false)
        }

        val cityImage = v!!.findViewById<ImageView>(R.id.sr_cityImage)
        Picasso.get().load(getItem(position)!!.city.image).into(cityImage)
        val cityName = v.findViewById<TextView>(R.id.sr_cityName)
        val countryName = v.findViewById<TextView>(R.id.sr_startAirport)
        cityName.text = getItem(position)!!.city.nom
        countryName.text = getItem(position)!!.city.pays
        val dateTime = v.findViewById<TextView>(R.id.sr_datetime)
        dateTime.text = getItem(position)!!.vol.heurelocale
        v.findViewById<TextView>(R.id.tv_airport).text = getItem(position)!!.vol.aeroid+", ${getItem(position)!!.vol.airline}"
        return v

    }
}