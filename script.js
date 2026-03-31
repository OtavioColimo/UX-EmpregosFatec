/* ============================================
   SCROLL REVEAL - OBSERVER
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => {
    observer.observe(section);
  });

  // Carregar perfil do GitHub
  loadGitHubProfile('otaviocolimo');
});

/* ============================================
   GITHUB API - CARREGAR PERFIL
   ============================================ */

async function loadGitHubProfile(username) {
  const profileContainer = document.getElementById('github-profile');
  
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
      throw new Error('Usuário não encontrado');
    }
    
    const data = await response.json();
    
    // Buscar repositórios
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&order=desc&per_page=3`);
    const repos = await reposResponse.json();
    
    // Construir HTML do perfil
    let profileHTML = `
      <div class="card github-profile-card">
        <div class="github-header">
          <img src="${data.avatar_url}" alt="${data.name}" class="github-avatar">
          <div class="github-info">
            <h3>${data.name || data.login}</h3>
            <p class="github-username">@${data.login}</p>
            ${data.bio ? `<p class="github-bio">${data.bio}</p>` : ''}
          </div>
        </div>
        
        <div class="github-stats">
          <div class="stat">
            <span class="stat-value">${data.public_repos}</span>
            <span class="stat-label">Repositórios</span>
          </div>
          <div class="stat">
            <span class="stat-value">${data.followers}</span>
            <span class="stat-label">Seguidores</span>
          </div>
          <div class="stat">
            <span class="stat-value">${data.following}</span>
            <span class="stat-label">Seguindo</span>
          </div>
        </div>
        
        ${data.location ? `<p class="github-detail"><strong>📍 Local:</strong> ${data.location}</p>` : ''}
        ${data.company ? `<p class="github-detail"><strong>🏢 Empresa:</strong> ${data.company}</p>` : ''}
        ${data.blog ? `<p class="github-detail"><strong>🌐 Blog:</strong> <a href="${data.blog}" target="_blank">${data.blog}</a></p>` : ''}
        
        ${repos.length > 0 ? `
          <div class="github-repos">
            <h4>📚 Projetos em Destaque</h4>
            <ul>
              ${repos.map(repo => `
                <li>
                  <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                  <p>${repo.description || 'Sem descrição'}</p>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
        
        <div class="github-action">
          <a href="https://github.com/${username}" target="_blank" class="btn-github">Ver Perfil Completo →</a>
        </div>
      </div>
    `;
    
    profileContainer.innerHTML = profileHTML;
    
  } catch (error) {
    profileContainer.innerHTML = `
      <div class="card error-message">
        <p>❌ Erro ao carregar perfil: ${error.message}</p>
      </div>
    `;
    console.error('Erro ao buscar perfil do GitHub:', error);
  }
}
