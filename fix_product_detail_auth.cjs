const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/ProductDetail.tsx', 'utf8');

const search = `              </div>
            </div>



          </div>`;

const replace = `              </div>
            </div>
            )}

          </div>`;

code = code.replace(search, replace);
fs.writeFileSync('src/pages/storefront/ProductDetail.tsx', code);
