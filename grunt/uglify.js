 //module.exports = {
 //  dist: {
 //    files: {
 //      '<%= yeoman.dist %>/scripts/scripts.js': [
 //        '<%= yeoman.dist %>/scripts/scripts.js'
 //      ]
 //    }
 //  }
 //};

 module.exports = {
     options: {
         mangle: false
     },
     distsourcefile: {
         files: {
             '<%= yeoman.dist %>/scripts/scripts.js': [
                 '<%= yeoman.dist %>/scripts/scripts.js'
             ],
                 '<%= yeoman.dist %>/<%= pkg.name %>.js': [
                 '<%= yeoman.dist %>/<%= pkg.name %>.js'
             ]
         }
     }
 };
