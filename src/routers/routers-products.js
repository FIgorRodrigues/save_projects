const { Router } = require('express');

class RoutersProduct{

  constructor(){
    this.projects = [];
    this.routers = this.createRouters(new Router());
  }

  checkExistProjects = (req, res, next) => {
    const project = this.projects.find(project => project.id == req.params.id);
    if(!project)
      return res.status(404).json({ error: 'project not found'});

    res.project = project;
    res.indexProject = this.projects.findIndex(project => project == res.project);

    return next();
  }

  checkAttributesRequest = (req, res, next) => {
    const { id, title, task } = req.body;
    if(! (id || title || task) )
      return res.status(400).json({ error: `JSON invalid: ${req.body}` });
    return next();
  }

  checkIdAttribute = (req, res, next) => {
    const id = req.params.id || req.body.id;
    if(!id || id <= 0)
      return res.status(400).json({ error: 'attribute id is invalid' });
    return next();
  }

  createRouters(routers){

    routers.get('', (req, res) => {
      const projectsOrderById = this.projects.sort((a, b) => a.id - b.id);
      res.json(projectsOrderById);
    });
    
    routers.get('/:id', this.checkExistProjects, (req, res) => res.json(res.project));
    
    routers.post('', this.checkAttributesRequest, this.checkIdAttribute, (req, res) => {
      const { body } = req;
      this.projects.push(body);
      return res.json(body);
    });
    
    routers.post('/:id/tasks', this.checkIdAttribute, this.checkExistProjects, (req, res) => {
      const { title } = req.body;
      const projectIndex = res.indexProject;
      
      this.projects[projectIndex].tasks.push(title);
    
      return res.json(this.projects[projectIndex]);
    });
    
    routers.put('/:id', this.checkIdAttribute, this.checkExistProjects, (req, res) => {
      const { title } = req.body;
      const projectIndex = res.indexProject;
      
      this.projects[projectIndex].title = title;
    
      return res.json(this.projects);
    });
    
    routers.delete('/:id', this.checkIdAttribute, this.checkExistProjects, (req, res) => {
      this.projects.splice(res.indexProject, 1);
      return res.send();
    });

    return routers;
  }
  
}

module.exports = new RoutersProduct().routers;