module.exports = routers => {

  //Array to save projects
  let projects = [];

  //Middlewares
  const checkExistProjects = (req, res, next) => {
    
    const project = projects.find( project => project.id == req.params.id );
    if(!project)
      return res.status(404).json({ error: 'project not found'});

    res.project = project;
    res.indexProject = projects.findIndex(project => project == res.project);

    return next();
  };

  const checkAttributesRequest = (req, res, next) => {
    const { id, title, task } = req.body;
    if(! (id || title || task) )
      return res.status(400).json({ error: `JSON invalid: ${req.body}` });
    return next();
  };

  const checkIdAttribute = (req, res, next) => {
    if(!req.params.id)
      return res.status(400).json({ error: 'attribute id is required' });
    return next();
  };

  routers.get('', (req, res) => {
    const projectsOrderById = projects.sort((a, b) => a.id - b.id);
    res.json(projectsOrderById)
  });
  
  routers.get('/:id', checkExistProjects, (req, res) => res.json(res.project));
  
  routers.post('', checkAttributesRequest, (req, res) => {
    const { body } = req;
    projects.push(body);
    return res.json(body);
  });
  
  routers.post('/:id/tasks', checkIdAttribute, checkExistProjects, (req, res) => {
    const { title } = req.body;
    const projectIndex = res.indexProject;
    
    projects[projectIndex].tasks.push(title);
  
    return res.json(projects[projectIndex]);
  });
  
  routers.put('/:id', checkIdAttribute, checkExistProjects, (req, res) => {
    const { title } = req.body;
    const projectIndex = res.indexProject;
    
    projects[projectIndex].title = title;
  
    return res.json(projects);
  });
  
  routers.delete('/:id', checkIdAttribute, checkExistProjects, (req, res) => {
    projects.splice(res.indexProject, 1);
    return res.send();
  });

  return routers;

}