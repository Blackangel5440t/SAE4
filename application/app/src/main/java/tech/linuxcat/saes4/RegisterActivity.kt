package tech.linuxcat.saes4

import android.content.Context
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import com.android.volley.Request
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.google.android.material.snackbar.Snackbar
import org.json.JSONArray
import org.json.JSONObject
import tech.linuxcat.saes4.types.API

class RegisterActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        val createAcc = findViewById<Button>(R.id.buttonCreateAcc)
        val email = findViewById<EditText>(R.id.editTextUserEmail)
        val password = findViewById<EditText>(R.id.editTextUserPassword)
        findViewById<Button>(R.id.buttonAlreadyHaveOne).setOnClickListener {
            startActivity(Intent(this,  LoginActivity::class.java))
            finish()
        }
        val queue = Volley.newRequestQueue(this)
        createAcc.setOnClickListener { view ->
            val rootJson = JSONObject()
            rootJson.put("login", email.text.toString())
            rootJson.put("email", email.text.toString())
            rootJson.put("password", password.text.toString())
            rootJson.put("token", "token")
            rootJson.put("like", JSONArray())
            queue.add(JsonObjectRequest(
                Request.Method.POST,
                API.postUser(),
                rootJson,
                {
                    if (email.text.toString().isBlank() || password.text.toString().isBlank()){
                        Snackbar.make(view, "Erreur : Vérifiez votre connexion a internet!", Snackbar.LENGTH_LONG).show()
                        return@JsonObjectRequest
                    }
                    val sharedPref = this.getSharedPreferences("DATA", MODE_PRIVATE)
                    sharedPref.edit().putString("email", email.text.toString()).commit()
                    startActivity(Intent(this, MainActivity::class.java))
                    finish()
                }, {
                    Log.d("WHATHAZETH",it.toString())
                    Snackbar.make(view, "Erreur : Vérifiez votre connexion a internet!", Snackbar.LENGTH_LONG).show()
                }
            ))
        }

    }
}