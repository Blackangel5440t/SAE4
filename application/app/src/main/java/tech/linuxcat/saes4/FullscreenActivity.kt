package tech.linuxcat.saes4

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.WindowCompat
import com.google.android.material.imageview.ShapeableImageView
import com.squareup.picasso.Picasso
import tech.linuxcat.saes4.databinding.ActivityFullscreenBinding


class FullscreenActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        super.onCreate(savedInstanceState)
        var binding = ActivityFullscreenBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setSupportActionBar(binding.toolbar5)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title=""

        val imgLink = intent.getStringExtra("url")
        if (imgLink==null || imgLink.isBlank()){
            finish()
            return
        }
        try{
            Picasso.get().load(imgLink).into(findViewById<ShapeableImageView>(R.id.fullscreenimg))
        } catch (e : Exception){
            finish()
            return
        }

    }
    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }
}