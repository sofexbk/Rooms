using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace TestMe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private static List<string> _values = new List<string>
        {
            "value1",
            "value2",
            "value3"
        };

        // GET: api/values
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return Ok(_values);
        }

        // GET: api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            if (id < 0 || id >= _values.Count)
            {
                return NotFound();
            }

            return Ok(_values[id]);
        }

        // POST: api/values
        [HttpPost]
        public IActionResult Post([FromBody] string value)
        {
            _values.Add(value);
            return CreatedAtAction(nameof(Get), new { id = _values.Count - 1 }, value);
        }

        // PUT: api/values/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] string value)
        {
            if (id < 0 || id >= _values.Count)
            {
                return NotFound();
            }

            _values[id] = value;
            return NoContent();
        }

        // DELETE: api/values/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (id < 0 || id >= _values.Count)
            {
                return NotFound();
            }

            _values.RemoveAt(id);
            return NoContent();
        }
    }
}
