package tech.linuxcat.saes4

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.RatingBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.WindowCompat
import com.google.android.material.imageview.ShapeableImageView
import com.squareup.picasso.Picasso
import tech.linuxcat.saes4.databinding.ActivityPlaceBinding
import tech.linuxcat.saes4.types.Place


class PlaceActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        super.onCreate(savedInstanceState)
        var binding = ActivityPlaceBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setSupportActionBar(binding.toolbar4)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val place = intent.getParcelableExtra<Place>("place")
        if (place==null){
            hideAndShowError("Erreur! Vérifiez votre connexion a internet!")
            return
        }
        findViewById<TextView>(R.id.titlePlaces).text = place.nom
        findViewById<TextView>(R.id.tv_inWhatCity).text = place.villenom
        findViewById<TextView>(R.id.tv_description).text = place.description
        findViewById<TextView>(R.id.tv_nomAvis).text = place.auteur + ", " + place.temps
        findViewById<TextView>(R.id.tv_avis).text = place.avis
        findViewById<RatingBar>(R.id.ratingBar).rating = place.rate
        try {
            Picasso.get().load(place.image).into(findViewById<ShapeableImageView>(R.id.place_image))
            findViewById<ShapeableImageView>(R.id.place_image).setOnClickListener {
                val fullImageIntent = Intent(
                    this,
                    FullscreenActivity::class.java
                )
                fullImageIntent.putExtra("url", place.image)
                startActivity(fullImageIntent)
            }
        } catch (e : Exception){
            hideAndShowError("Erreur de chargement de l'image!\nVérifiez votre connexion a internet")
        }
    }

    fun hideAndShowError(string: String){
        findViewById<TextView>(R.id.titlePlaces).visibility = View.INVISIBLE
        findViewById<TextView>(R.id.tv_inWhatCity).visibility = View.INVISIBLE
        findViewById<TextView>(R.id.tv_description).visibility = View.INVISIBLE
        findViewById<TextView>(R.id.tv_avis).visibility = View.INVISIBLE
        findViewById<TextView>(R.id.tv_nomAvis).visibility = View.INVISIBLE
        findViewById<RatingBar>(R.id.ratingBar).visibility = View.INVISIBLE
        findViewById<ShapeableImageView>(R.id.place_image).visibility = View.INVISIBLE
        findViewById<TextView>(R.id.placeErrorText).text = string
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.menu_main, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        return when (item.itemId) {
            R.id.action_settings -> true
            R.id.action_logout -> {
                val sharedPref = this.getSharedPreferences("DATA", Context.MODE_PRIVATE)
                sharedPref.edit().putString("email", null)
                startActivity(Intent(this, LoginActivity::class.java))
                finish()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }

}

