const Circle = Parse.Object.extend('Circle');
const Nation = Parse.Object.extend('Nation');
const City   = Parse.Object.extend('City');
const State  = Parse.Object.extend('State');

Parse.Cloud.define("hello", (request) => {
  const name = request.params.name;
 	return("Hello world from " + name + " from Cloud Code desktop"); 
 });

 Parse.Cloud.define("createCircle", async (request) => {
  const name = request.params.name
  if(name == null || name == "") throw "Name is required";

  const description = request.params.description
  const circle = new Circle()
  circle.set("name", name)
  circle.set("description", description)
  //return circle.save();
  const savedCircle = await circle.save(null, {useMasterKey: true})
  //return savedCircle
  return savedCircle.id
 })

 Parse.Cloud.define("getNation", async (request) => {
    const id = request.params.id
    if(id == null || id == "") throw "Id is required";
    const query = new Parse.Query(Nation)
    query.equalTo("objectId", id)
    const nation = await query.first({useMasterKey: true})
    return nation     
 })

 Parse.Cloud.define("putStateInCity", async (request) => {
  

  let test = [];

  try {
    const queryState = new Parse.Query(State);
    const states = await queryState.find({useMasterKey: true})
    states.forEach(async state => {
      const queryCity = new Parse.Query(City)
      //queryCity.limit(6000);
      //test.push(state.toJSON().name)
      //test.push(state.get("idsql"))
      queryCity.equalTo("uf", state.get("idsql")) 
      queryCity.notEqualTo("viculado", true) 

      //queryCity.equalTo("uf", state.get("idsql")) 
      const citys = await queryCity.find({useMasterKey: true})
     
      
      citys.forEach(async city => {
        //test.push(city.toJSON().name)
        city.set("state", state)
        city.set("viculado", true)
        await city.save(null, {useMasterKey: true})
        //test.push(city)
      })
    });
    // const queryCity = new Parse.Query(City)
    // queryCity.equalTo("uf", id)
    // const nation = await query.first({useMasterKey: true})
    // return test
    return true
  } catch (error) {
    return error  
  }

  
})

 //xhgmoq4yRn


Parse.Cloud.define("putStateInCity2", async (request) => {
  
  const query = new Parse.Query(City)
  query.limit(5000);
  query.equalTo("idsql", 381) 
  const citys = await query.find({useMasterKey: true})

  
  const queryState = new Parse.Query(State)
  queryState.equalTo("uf", 5) 
  const state = await queryState.find({useMasterKey: true}).first
  let test = [];
  citys.forEach(async city => {
        //test.push(city.toJSON().name)
        city.set("state", state)
        await city.save(null, {useMasterKey: true})
        //test.push(city.toJSON().name)
        test.push(city)
  })



  return test

  
  

  
  
})