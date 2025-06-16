package tech.linuxcat.saes4.adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ImageView
import android.widget.TextView
import com.squareup.picasso.Picasso
import tech.linuxcat.saes4.R
import tech.linuxcat.saes4.types.Place

class PlaceAdapter(context: Context, resource : Int, objects : List<Place>) : ArrayAdapter<Place>(context, resource, objects) {
    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val v: View?
        val inf = LayoutInflater.from(context)
        v = inf.inflate(if (position%2==0)R.layout.monument_left else R.layout.monument_right, parent, false)!!

        val img = v.findViewById<ImageView>(if (position%2==0)R.id.m_image_left else R.id.m_image_right)
        val txt = v.findViewById<TextView>(if (position%2==0)R.id.m_title_left else R.id.m_title_right)
        Picasso.get().load(getItem(position)!!.image).into(img)
        txt.text = getItem(position)!!.nom
        return v
    }
}