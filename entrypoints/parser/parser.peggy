Expression
  = head:(Term)? tail:( _ ("+" / "-") _ Term)* _ {
      return tail.reduce(function(result, element) {
        if (element[1] === "+") { return result + element[3]; }
        if (element[1] === "-") { return result - element[3]; }
      }, head);
    }

_ "whitespace"
  = [ \t\n\r]*

Integer "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }

Qualifier "qualifier"
  = qual:[smhd]? _ {
  switch(qual) {
  case "s":
    return 1/60;
  case null:
  case "m":
    return 1;
    break;
  case "h":
    return 60;
    break;
  case "d":
    return 60*24;
    break;
}
  }

Time = int:Integer qual:Qualifier {return int*qual} / ident:([a-zA-Z]+[0-9]*) {var key = ident.flat().join(""); return options[key] || 0}

Term
  = head:Sequence tail:(_ ("*" / "/") _ Sequence)* {
      return tail.reduce(function(result, element) {
        if (element[1] === "*") { return result * element[3]; }
        if (element[1] === "/") { return result / element[3]; }
      }, head);
    }

Sequence
  = head:Time tail:(_ Time)* {
    return tail.reduce(
    function(result,elem) {
      return result + elem[1]
    }
    ,head);} / "(" _ expr:Expression _ ")" {return expr}
