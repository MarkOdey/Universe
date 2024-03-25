
import {
  Mesh, MeshBuilder, Vector3
} from "@babylonjs/core";

class Universe {
    static particles:Particle[]=[];
   
     numberOfLayers=1;
   
     initialPosition=0;
   
     sizeOfUniverse=20;
   
     static cluster;
   
     mass;
   
     
     constructor (){
   
       
      Universe.cluster= new Cluster({layer:this.numberOfLayers, position:new Vector3(0,0,0), radius:this.sizeOfUniverse});
   
   
      this.mass= Universe.particles.length;
   
   
   
   
     }
   
     tic(){
   
   
   
       Universe.cluster.tic();
   
     }
   

   
     render(scene,camera){
       Universe.cluster.render(scene);

     //  camera.lockedTarget = Universe.cluster.clusters.mesh;

     }
   }
   
   class Cluster{
     layer;
   
     clusters:Cluster[]=[];
     particles:Particle[]=[];
   
     mass=0;
   
     
     radius=2;
     position:Vector3;
   
     centerOfMass:Vector3=new Vector3(0,0,0);
     parent:Cluster;
   
   
     gravity:Vector3=new Vector3();
   
     velocity:Vector3=new Vector3();
    // acceleration:Vector4;
   
   
     mesh:Mesh;
   
   
     furthest:Cluster;
     furthestIndex=-1;
     furthestDistance=1;

       
   
   
     constructor({layer=1, position=new Vector3(), radius=2, parent=null, amount=20}){
   
       this.layer=layer;
       this.position=position;
       this.parent=parent;
   
       
   


       console.log('create layer.')
       
       if(layer>0){
   
   
        for(let i =0; i<amount; i++){

          const rad=2*Math.PI*i/(amount+1);

          console.log(rad);
          this.addCluster({layer:layer-1,  position:position.add(new Vector3(10*radius*Math.sin(rad),10*radius*Math.cos(rad),Math.random()*10)), radius:radius})
  
         }
     
   
   
         //this.clusters.push(new Cluster({layer:nextLayer, position: position_4, radius:radius/2, parent:this}));
       }else{
   
   
         this.centerOfMass=this.position;
   /*
   
         let particle =new Particle({ position: position_1, radius:radius/2,parent:this})
   
         this.particles.push(particle);
         Universe.particles.push(particle);
   
   
   
          particle =new Particle({ position: position_2, radius:radius/2,parent:this})
   
         this.particles.push(particle);
         Universe.particles.push(particle);
   
   
   
          particle =new Particle({ position: position_3, radius:radius/2,parent:this})
   
         this.particles.push(particle);
         Universe.particles.push(particle);
   
   
   
   
         particle =new Particle({ position: position_4, radius:radius/2,parent:this})
   
         this.particles.push(particle);
         Universe.particles.push(particle); */
         
   
   
   
       }
   
   
   
     }

    addCluster({layer:nextLayer, position: position, radius}){


      this.clusters.push(new Cluster({layer:nextLayer, position: position, radius:radius, parent:this}));
      

    }
   
      calculateMass(){
   
       let mass =0;
   
       if(this.clusters.length<0){
   
         this.clusters.forEach((cluster)=>{
           mass +=cluster.mass;
         });
   
   
         this.mass =mass;
       }else{
         this.mass=1
       }
   
   
      /* this.particles.forEach((particle)=>{
         mass +=particle.mass;
       });*/
   
       
     }
   
     calculateCenterOfMass(){
   
   
       let centerOfMass=new Vector3(0,0,0);
   
   
       
       let particleCount=0;
   
   
       this.clusters.forEach((cluster)=>{
     
         particleCount+=1;
   
         if(cluster.centerOfMass._isDirty){
           centerOfMass= centerOfMass.add(cluster.centerOfMass);
   
         }else if(cluster.position._isDirty){
           centerOfMass= centerOfMass.add(cluster.position);
         }
   
        
       });
  
   
   
   
       if(particleCount === 0) {
   
         this.centerOfMass=this.position;
   
       } else{
       
         this.centerOfMass=new Vector3(centerOfMass.x/particleCount,centerOfMass.y/particleCount,centerOfMass.z/particleCount);
       }
   
   
       
     }
   
     calculateTheFurthestParticle(){
   
       let furthestDistance = 0;
       let secondfurthestDistance=0;
   
   
   
       if(this.clusters.length===0){

         return;
       }
   
       this.clusters.forEach((cluster)=>{
   
   
         const distance =Vector3.Distance(this.centerOfMass, cluster.centerOfMass);
   
         furthestDistance = Math.max(furthestDistance, distance);
   
   
         if(furthestDistance <= distance){
           this.furthest=cluster;
           this.furthestDistance=furthestDistance;
         }
   
       });
   
       
   
       this.clusters.forEach((cluster)=>{
   
   
         const distance =Vector3.Distance(this.centerOfMass, cluster.centerOfMass);
   
         if(furthestDistance <= distance){
   
   
          secondfurthestDistance = Math.max(secondfurthestDistance, distance);
   
   
         }
   
   
       });
   
   
       this.radius = furthestDistance;
     }
   


   
     checkSwap(){
   
   
   
      let closestCluster;
   
   
       this.clusters.forEach((cluster,index)=>{
   
   
   
   
         if(cluster.furthest && Vector3.Distance(this.centerOfMass, cluster.furthest.centerOfMass)< cluster.furthestDistance){
   
   
           closestCluster=cluster;
         
   
         }
   
         
   
       });
   
  
       if(closestCluster){
        // closestCluster.clusters.splice(closestCluster.furthestIndex, 1, this.furthest);
   
      //   this.clusters.splice(this.furthestIndex, 1, closestCluster);
     
   
       }
      
   
     }
   
   
   
   
     applyVelocity(){
   
   
    //   this.centerOfMass=this.centerOfMass.add(new Vector3(this.velocity.x*this.velocity.w,this.velocity.y*this.velocity.w, this.velocity.z*this.velocity.w));
       this.position=this.position.add(this.velocity);

     }
   
     applyGravity(){
   
      if(this.parent){

        this.parent.clusters.forEach((particle)=>{

          if(this===particle){
            return;
          }
          const distance =Vector3.Distance(this.position, particle.position);




          let orientation = this.position.subtract(particle.position).normalize();
   
  

          if(distance<this.radius){

      
            let gravityForce = (distance-this.radius)/(distance+1);

            const gravity = new Vector3(orientation.x*gravityForce, orientation.y*gravityForce, orientation.z*gravityForce);
 
             
             this.velocity= this.velocity.add(gravity);
 

            console.log('colliding!')
  
            //this.velocity.w=this.velocity.w;
      
          } else {

            let gravityForce = -0.1/distance;

           const gravity = new Vector3(orientation.x*gravityForce, orientation.y*gravityForce, orientation.z*gravityForce);
 
            
            this.velocity= this.velocity.add(gravity);


         //   gravity = new Vector4(this.position.x, this.position.y, this.position.z,0);
            console.log('not colliding');
          }
    



        });
   
     }
     
    }
   
   
     tic(){
       
       this.clusters.forEach((cluster)=>{
         cluster.tic();
       });
   
           
     /*  this.particles.forEach((particle)=>{
         particle.tic();
       });*/
   
   
       this.calculateMass();
   
       this.calculateCenterOfMass();
       this.calculateTheFurthestParticle();
   
   
   
      // this.calculateVelocity();
       //this.calculateGravity();
   
       this.applyGravity();
      // this.applyCollision()
       this.applyVelocity();
   
     //  console.log(this.gravity)
   
     //console.log(this.velocity)
    // this.checkSwap();


      if(this.mesh){
        this.mesh.position =this.centerOfMass;
        this.mesh.scaling= new Vector3(this.radius*2,this.radius*2,this.radius*2);
    
      }
    

       
     }
   
   
   
   
   
     render(scene){
   
   
      this.mesh = MeshBuilder.CreateSphere(
         "sphere",
         { diameter: 1},
         scene
       );
       this.mesh.visibility=0.1;
       this.mesh.position=this.position;
   
   
   
   
       this.mesh.visibility=0.5;
         
   
       this.clusters.forEach((cluster)=>{
         cluster.render(scene);
       });
   
       this.particles.forEach((particle)=>{
         particle.render(scene);
       });
   
     }
   }
   
   class Particle {
   
   
     position:Vector3;
     mass=1;
     parent:Cluster;
   
     velocity:Vector3 =new Vector3();
     acceleration:Vector3;
   
   
   
   
     mesh:Mesh;
   
   
     constructor({position, radius, parent}){
   
   
         this.position=position;
   
         this.parent=parent;
   
   
       
   
   
   
     }
   
   
     tic(){
   
   
       
     }
   
     render(scene){
     this.mesh = MeshBuilder.CreateSphere(
         "sphere",
         { diameter: 1 },
         scene
       );
         
       
       this.mesh.position= this.position;
     }
   
     update(){
      this.mesh.position= this.position;
   
     }
   
   
   }

export {

  Universe, Cluster, Particle
};
   