<template>
    <navbar @nuovo-post-creato="aggiungiPost" />
    <main class="container-main">
      <div class="da-fare">
        <h1>Da fare</h1>
        <div v-for="post in posts" :key="post.id" class="card mx-auto" style="width: 18rem;">
          <div class="card-body">
            <h5 class="card-title">{{ post.title }}</h5>
            <p class="card-text">{{ post.content }}</p>
            <span v-for="(tag, index) in post.tags" :key="index">
              {{ tag.name }}{{ index < post.tags.length - 1 ? ', ' : '' }}
            </span>
            <div class="button">
              <button class="btn btn-primary" @click="apriModale(post)">Modifica</button>
              <button class="btn btn-danger mx-3" @click="eliminaPost(post.slug)">Elimina</button>
            </div>
          </div>
        </div>
      </div>
      <div class="finito">
        <h1>Finiti</h1>
      </div>
    </main>
  
    <!-- Modale per la modifica -->
    <div v-if="isEditing" class="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modifica Post</h5>
            <button type="button" class="btn-close" @click="chiudiModale"></button>
          </div>
          <div class="modal-body">
            <input type="text" v-model="editedContent.title" placeholder="Titolo" class="form-control">
            <textarea v-model="editedContent.content" placeholder="Contenuto" class="form-control"></textarea>
            <div class="form-check">
              <input type="checkbox" v-model="editedContent.published" class="form-check-input">
              <label class="form-check-label">Pubblicato</label>
            </div>
            <input type="text" v-model="editedContent.category" placeholder="Categoria" class="form-control">
            <input type="text" v-model="editedContent.tags" placeholder="Tag (separati da virgola)" class="form-control">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="chiudiModale">Chiudi</button>
            <button type="button" class="btn btn-primary" @click="confermaModifica">Salva</button>
          </div>
        </div>
      </div>
    </div>
</template>
  
  
  
<script>
import Navbar from './homeComponents/navbar.vue';

export default {
  components: {
    Navbar
  },
  data() {
    return {
      posts: [],
      isEditing: false,
      currentPost: null,
      editedContent: {
        title: '',
        content: '',
        published: false,
        category: '',
        tags: ''
      }
    };
  },
  mounted() {
    this.caricaPost();
  },
  methods: {
    caricaPost() {
      fetch('http://localhost:3000/posts')
        .then(response => response.ok ? response.json() : Promise.reject('Errore nel caricamento dei post'))
        .then(data => this.posts = data)
        .catch(error => console.error('Errore durante il recupero dei post:', error));
    },
    aggiungiPost(post) {
      this.posts.push(post);
    },
    eliminaPost(postSlug) {
      fetch(`http://localhost:3000/posts/${postSlug}`, { method: 'DELETE' })
        .then(response => response.ok ? this.caricaPost() : console.error('Errore durante l\'eliminazione del post:', response.statusText))
        .catch(error => console.error('Errore durante l\'eliminazione del post:', error));
    },
    apriModale(post) {
      console.log("Apertura modale per il post:", post);
      this.currentPost = post;
      this.editedContent = {
        title: post.title,
        content: post.content,
        published: post.published,
        category: post.category,
        tags: post.tags.map(tag => tag.name).join(', ')
      };
      this.isEditing = true;
    },
    chiudiModale() {
      console.log("Chiusura modale");
      this.isEditing = false;
      this.currentPost = null;
      this.editedContent = { title: '', content: '', published: false, category: '', tags: '' };
    },
    confermaModifica() {
      const nuovoContenuto = {
        title: this.editedContent.title,
        content: this.editedContent.content,
        published: this.editedContent.published,
        category: this.editedContent.category,
        tags: this.editedContent.tags.split(',').map(tag => tag.trim())
      };
      this.modificaPost(this.currentPost.slug, nuovoContenuto);
      this.chiudiModale();
    },
    modificaPost(postSlug, nuovoContenuto) {
      fetch(`http://localhost:3000/posts/${postSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuovoContenuto)
      })
      .then(response => response.ok ? this.caricaPost() : console.error('Errore durante la modifica del post:', response.statusText))
      .catch(error => console.error('Errore durante la modifica del post:', error));
    }
  }
};
</script>

  
  
  
  
<style scoped>
.container-main {
  display: flex;
  width: 100%;
  height: 100%;
}
.da-fare, .iniziato, .finito {
  padding-top: 50px;
  text-align: center;
  width: 100vw;
  height: 100vh;
  border: solid 1px black;
}
.modal {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}
.modal-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 5px;
  width: 500px;
}
.modal-content {
  padding: 20px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 10px;
}
.modal-title {
  margin-bottom: 0;
}
.modal-body {
  padding-bottom: 20px;
}
.modal-footer {
  border-top: 1px solid #dee2e6;
  padding-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>

  

  
  