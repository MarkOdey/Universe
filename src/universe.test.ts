import {
  Vector3
} from "@babylonjs/core";
import { Cluster } from "./universe";




const epsilon= Math.pow(10,12);
describe('Cluster', () => {
    //expect(Universe.hello()).toBe('hello');
 

    test('Validating default values', ()=>{
      const cluster=new Cluster({  });
      expect(cluster.clusters.length).toEqual(4);
    })


    test('Validating progression with two particles', ()=>{
      const cluster = new Cluster({amount:2})

      console.log(cluster.position);
      console.log(cluster.clusters[0].position);
      console.log(cluster.clusters[1].position);

      console.log(cluster.centerOfMass);

      expect(cluster.clusters[0].position.equalsWithEpsilon(new Vector3(0,4,0),epsilon)).toBeTruthy(); 
      expect(cluster.clusters[1].position.equalsWithEpsilon(new Vector3(0,-4,0),epsilon)).toBeTruthy(); 



      cluster.tic();


      expect(cluster.clusters[0].position.equalsWithEpsilon(new Vector3(0,2,0),epsilon)).toBeTruthy(); 
      expect(cluster.clusters[1].position.equalsWithEpsilon(new Vector3(0,-2,0),epsilon)).toBeTruthy(); 

      expect(cluster.clusters[0].velocity.equalsWithEpsilon(new Vector3(0,1,0),epsilon)).toBeTruthy(); 
      expect(cluster.clusters[1].velocity.equalsWithEpsilon(new Vector3(0,-1,0),epsilon)).toBeTruthy(); 



      cluster.tic();


      expect(cluster.clusters[0].position.equalsWithEpsilon(new Vector3(0,2,0),epsilon)).toBeTruthy(); 
      expect(cluster.clusters[1].position.equalsWithEpsilon(new Vector3(0,-2,0),epsilon)).toBeTruthy(); 



    })

    
  });