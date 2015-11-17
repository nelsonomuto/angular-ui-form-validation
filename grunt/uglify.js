 //module.exports = {
 //  dist: {
 //    files: {
 //      '<%= config.path.dist %>/scripts/scripts.js': [
 //        '<%= config.path.dist %>/scripts/scripts.js'
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
             '<%= config.path.dist %>/scripts/scripts.js': [
                 '<%= config.path.dist %>/scripts/scripts.js'
             ],
                 '<%= config.path.dist %>/<%= pkg.name %>.js': [
                 '<%= config.path.dist %>/<%= pkg.name %>.js'
             ]
         }
     }
 };
