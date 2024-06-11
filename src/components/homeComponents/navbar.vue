<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Todo List</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" :to="{name: 'home'}">Home</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Da fare</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Completati</a>
            </li>
            <li class="nav-item">
              <span class="dropdown-item nav-link" @click="mostraModulo">Aggiungi nuovo todo</span>
              <div v-if="mostraForm" class="modal">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Nuovo Todo</h5>
                      <button type="button" class="btn-close" @click="chiudiModulo"></button>
                    </div>
                    <div class="modal-body">
                      <input type="text" v-model="titolo" placeholder="Titolo" class="form-control">
                      <textarea v-model="content" placeholder="Contenuto" class="form-control"></textarea>
                      <input type="checkbox" v-model="publicato" class="form-check-input"> Pubblicato<br>
                      <input type="text" v-model="categoria" placeholder="Categoria" class="form-control">
                      <input type="text" v-model="tag" placeholder="Tag" class="form-control">
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" @click="chiudiModulo">Chiudi</button>
                      <button type="button" class="btn btn-primary" @click="creaNuovoTodo">Salva</button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>

export default {
  data() {
    return {
      mostraForm: false,
      titolo: '',
      content: '',
      publicato: false,
      categoria: '',
      tag: ''
    };
  },
  methods: {
    mostraModulo() {
      this.mostraForm = true;
    },
    chiudiModulo() {
      this.mostraForm = false;
      this.resetForm();
    },
    resetForm() {
      this.titolo = '';
      this.content = '';
      this.publicato = false;
      this.categoria = '';
      this.tag = '';
    },
    creaNuovoTodo() {
      fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: this.titolo,
          content: this.content,
          published: this.publicato,
          category: this.categoria,
          tags: this.tag.split(',').map(tag => tag.trim()) 
        }),
      })
    .then(response => {
        if (response.ok) {
          console.log('Nuovo todo creato con successo!');
          this.$emit('nuovo-post-creato');
        } else {
          return response.text().then(text => { throw new Error(text) });
        }
      })
    .then(()=>{
        this.chiudiModulo(); 

    })

    

    
    .catch(error => {
        console.error('Errore durante la creazione del nuovo todo:', error);
      });
    }
  }
};

  </script>
  
  <style scoped>
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
  